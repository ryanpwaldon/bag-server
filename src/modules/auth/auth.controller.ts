import { ConfigService } from '@nestjs/config'
import { Controller, Get, Query, BadRequestException, Res, Req } from '@nestjs/common'
import { SubscriptionService } from '../subscription/subscription.service'
import { InstallationService } from '../installation/installation.service'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { generate } from 'nonce-next'
import { Response } from 'express'
import qs from 'qs'
import { WidgetService } from '../widget/widget.service'

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private authService: AuthService,
    private installationService: InstallationService,
    private subscriptionService: SubscriptionService,
    private widgetService: WidgetService
  ) {}

  @Get()
  auth(@Res() res, @Query() { shop: shopOrigin }) {
    if (!shopOrigin) throw new BadRequestException('Missing shop query param.')
    const nonce = generate()
    const scope = this.configService.get('SHOPIFY_SCOPE')
    const apiKey = this.configService.get('SHOPIFY_API_KEY')
    const callbackUrl = `${this.configService.get('SERVER_URL')}/auth/callback`
    const querystring = qs.stringify({ client_id: apiKey, scope, redirect_uri: callbackUrl, state: nonce })
    const authorizationUrl = `https://${shopOrigin}/admin/oauth/authorize?${querystring}`
    res.cookie('state', nonce, { sameSite: 'none', secure: true })
    res.redirect(authorizationUrl)
  }

  @Get('callback')
  async callback(@Res() res: Response, @Req() req, @Query() { hmac, state, shop: shopOrigin, code }) {
    this.authService.verifyOrigin(req.cookies.state, state)
    this.authService.verifyHmac(hmac, req)
    const accessToken = await this.authService.requestAccessToken(shopOrigin, code)
    const user = (await this.userService.findOne({ shopOrigin })) || (await this.userService.create({ shopOrigin }))
    user.accessToken = accessToken
    user.uninstalled = false
    await user.save()
    req.user = user
    await Promise.all([
      this.subscriptionService.sync(),
      this.subscriptionService.registerOnUpdateWebhook(),
      this.installationService.registerUninstallWebhook(),
      this.installationService.createScriptTag(),
      this.widgetService.findMyOrCreate()
    ])
    const redirectUrl = await this.installationService.findAppUrl()
    res.redirect(redirectUrl)
  }
}
