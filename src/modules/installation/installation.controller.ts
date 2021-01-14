import { Controller, Get, Query, BadRequestException, Res, Req, UseGuards, HttpService } from '@nestjs/common'
import { REQUIRED_ACCESS_SCOPES } from 'src/modules/access-scope/access-scope.constants'
import { ShopifyInstallationGuard } from 'src/common/guards/shopify-installation.guard'
import { REDIRECT_PATH } from 'src/modules/installation/installation.constants'
import { SubscriptionService } from '../subscription/subscription.service'
import { DisplayScope, ScriptTagService } from '../script-tag/script-tag.service'
import { CartService } from 'src/modules/cart/cart.service'
import { WebhookService } from '../webhook/webhook.service'
import { AppUrlService } from '../app-url/app-url.service'
import { User } from 'src/modules/user/schema/user.schema'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { generate } from 'nonce-next'
import { Types } from 'mongoose'
import qs from 'qs'
import {
  WEBHOOK_PATH_ORDER_CREATED,
  WEBHOOK_PATH_SUBSCRIPTION_UPDATED,
  WEBHOOK_PATH_UNINSTALLED
} from 'src/modules/webhook/webhook.constants'

type RequestWithUser = Request & { user: User }

@Controller('installation')
export class InstallationController {
  constructor(
    private readonly httpService: HttpService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly appUrlService: AppUrlService,
    private readonly webhookService: WebhookService,
    private readonly scriptTagService: ScriptTagService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Get('start')
  start(@Res() res: Response, @Query('shop') shopOrigin: string) {
    if (!shopOrigin) throw new BadRequestException('Missing shop query param.')
    const nonce = generate()
    const scope = REQUIRED_ACCESS_SCOPES.join(',')
    const apiKey = this.configService.get('SHOPIFY_API_KEY')
    const redirectUrl = `${this.configService.get('SERVER_URL')}/installation/${REDIRECT_PATH}`
    const querystring = qs.stringify({ client_id: apiKey, scope, redirect_uri: redirectUrl, state: nonce })
    const authorizationUrl = `https://${shopOrigin}/admin/oauth/authorize?${querystring}`
    res.cookie('state', nonce, { sameSite: 'none', secure: true })
    res.redirect(authorizationUrl)
  }

  @Get(REDIRECT_PATH)
  @UseGuards(ShopifyInstallationGuard)
  async finalise(
    @Res() res: Response,
    @Req() req: RequestWithUser,
    @Query('shop') shopOrigin: string,
    @Query('code') authCode: string
  ) {
    const accessToken = await this.fetchAccessToken(shopOrigin, authCode)
    const user = (await this.userService.findOne({ shopOrigin })) || (await this.userService.create({ shopOrigin }))
    user.accessToken = accessToken
    user.uninstalled = false
    await user.save()
    req.user = user
    await Promise.all([
      this.subscriptionService.sync(user),
      this.webhookService.create('ORDERS_CREATE', `/webhook/${WEBHOOK_PATH_ORDER_CREATED}`),
      this.webhookService.create('APP_UNINSTALLED', `/webhook/${WEBHOOK_PATH_UNINSTALLED}`),
      this.webhookService.create('APP_SUBSCRIPTIONS_UPDATE', `/webhook/${WEBHOOK_PATH_SUBSCRIPTION_UPDATED}`),
      this.scriptTagService.create(this.configService.get('PLUGIN_SCRIPT_URL') as string, DisplayScope.ONLINE_STORE),
      this.cartService.create({ user: Types.ObjectId(user.id as string) })
    ])
    const appUrl = await this.appUrlService.find()
    res.redirect(appUrl)
  }

  async fetchAccessToken(shopOrigin: string, authCode: string) {
    const response = await this.httpService
      .request({
        method: 'post',
        url: `https://${shopOrigin}/admin/oauth/access_token`,
        data: {
          code: authCode,
          client_id: this.configService.get('SHOPIFY_API_KEY'),
          client_secret: this.configService.get('SHOPIFY_API_SECRET_KEY')
        }
      })
      .toPromise()
    return response.data.access_token
  }
}
