import { Controller, Get, Query, BadRequestException, Res, Req, Post, Body } from '@nestjs/common'
import { SubscriptionService } from '../subscription/subscription.service'
import { ScriptTagService } from '../script-tag/script-tag.service'
import { InstallationService } from './installation.service'
import { WebhookService } from '../webhook/webhook.service'
import { AppUrlService } from '../app-url/app-url.service'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'
import { generate } from 'nonce-next'
import { Logger } from 'nestjs-pino'
import { Request, Response } from 'express'
import { User } from 'src/modules/user/schema/user.schema'
import { CartService } from 'src/modules/cart/cart.service'
import qs from 'qs'
import { Types } from 'mongoose'

@Controller('installation')
export class InstallationController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly installationService: InstallationService,
    private readonly appUrlService: AppUrlService,
    private readonly webhookService: WebhookService,
    private readonly scriptTagService: ScriptTagService,
    private readonly subscriptionService: SubscriptionService,
    private readonly cartService: CartService,
    private readonly logger: Logger
  ) {}

  @Get('install')
  install(@Res() res: Response, @Query('shop') shopOrigin: string) {
    if (!shopOrigin) throw new BadRequestException('Missing shop query param.')
    const nonce = generate()
    const scope = this.configService.get('SHOPIFY_SCOPE')
    const apiKey = this.configService.get('SHOPIFY_API_KEY')
    const redirectUrl = `${this.configService.get('SERVER_URL')}/installation/install/confirm`
    const querystring = qs.stringify({ client_id: apiKey, scope, redirect_uri: redirectUrl, state: nonce })
    const authorizationUrl = `https://${shopOrigin}/admin/oauth/authorize?${querystring}`
    res.cookie('state', nonce, { sameSite: 'none', secure: true })
    res.redirect(authorizationUrl)
  }

  @Get('install/confirm')
  async installConfirm(
    @Res() res: Response,
    @Req() req: Request & { user: User },
    @Query('hmac') hmac: string,
    @Query('state') state: string,
    @Query('shop') shopOrigin: string,
    @Query('code') authCode: string
  ) {
    // verify request authenticity
    this.installationService.verifyHmac(hmac, req.query)
    this.installationService.verifyOrigin(req.cookies.state, state)
    // get access token
    const accessToken = await this.installationService.getAccessToken(shopOrigin, authCode)
    // update/create user
    const user = (await this.userService.findOne({ shopOrigin })) || (await this.userService.create({ shopOrigin }))
    user.accessToken = accessToken
    user.uninstalled = false
    await user.save()
    // attach user to request
    req.user = user
    // run installation tasks
    await Promise.all([
      this.subscriptionService.sync(),
      this.webhookService.create('ORDERS_CREATE', '/order/created'),
      this.webhookService.create('APP_SUBSCRIPTIONS_UPDATE', '/subscription/sync'),
      this.webhookService.create('APP_UNINSTALLED', '/installation/uninstalled'),
      this.scriptTagService.create(this.configService.get('PLUGIN_SCRIPT_URL') as string),
      this.cartService.create({ user: Types.ObjectId(user.id as string) })
    ])
    // redirect to app url
    const redirectUrl = await this.appUrlService.find()
    res.redirect(redirectUrl)
  }

  @Post('uninstalled')
  async onUninstalled(@Body() body: { myshopify_domain: string }) {
    this.logger.log('Webhook triggered: APP_UNINSTALLED')
    const shopOrigin = body.myshopify_domain
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) return
    user.uninstalled = true
    user.onboarded = false
    return user.save()
  }
}
