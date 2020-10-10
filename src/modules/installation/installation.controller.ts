import { Controller, Get, Query, BadRequestException, Res, Req, Post, Body } from '@nestjs/common'
import { SubscriptionService } from '../subscription/subscription.service'
import { ScriptTagService } from '../script-tag/script-tag.service'
import { InstallationService } from './installation.service'
import { WebhookService } from '../webhook/webhook.service'
import { PluginService } from '../plugin/plugin.service'
import { MetaService } from '../meta/meta.service'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'
import { generate } from 'nonce-next'
import { Logger } from 'nestjs-pino'
import { Response } from 'express'
import qs from 'qs'

@Controller('installation')
export class InstallationController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly installationService: InstallationService,
    private readonly metaService: MetaService,
    private readonly webhookService: WebhookService,
    private readonly scriptTagService: ScriptTagService,
    private readonly subscriptionService: SubscriptionService,
    private readonly pluginService: PluginService,
    private readonly logger: Logger
  ) {}

  @Get('install')
  install(@Res() res, @Query() { shop: shopOrigin }) {
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
  async installConfirm(@Res() res: Response, @Req() req, @Query() { hmac, state, shop: shopOrigin, code: authCode }) {
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
      this.webhookService.create('APP_SUBSCRIPTIONS_UPDATE', '/subscription/sync'),
      this.webhookService.create('APP_UNINSTALLED', '/installation/uninstall'),
      this.scriptTagService.create(this.configService.get('PLUGIN_SCRIPT_URL')),
      this.pluginService.findMyOrCreate()
    ])
    // redirect to app url
    const redirectUrl = await this.metaService.getAppUrl()
    res.redirect(redirectUrl)
  }

  @Post('uninstall')
  async uninstall(@Body() body) {
    this.logger.log('Webhook triggered: APP_UNINSTALLED')
    const shopOrigin = body.myshopify_domain
    const user = await this.userService.findOne({ shopOrigin })
    user.uninstalled = true
    user.onboarded = false
    return user.save()
  }
}
