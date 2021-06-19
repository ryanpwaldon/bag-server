import qs from 'qs'
import { Types } from 'mongoose'
import { generate } from 'nonce-next'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../user/user.service'
import { User } from 'src/modules/user/schema/user.schema'
import { Template } from 'src/modules/mail/types/template'
import { CartService } from 'src/modules/cart/cart.service'
import { WebhookService } from '../webhook/webhook.service'
import { GetUser } from 'src/common/decorators/user.decorator'
import { MailService, Persona } from 'src/modules/mail/mail.service'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { AffiliateService } from 'src/modules/affiliate/affiliate.service'
import { SubscriptionService } from '../subscription/subscription.service'
import { REDIRECT_PATH } from 'src/modules/installation/installation.constants'
import { ShopDetailsService } from 'src/modules/shop-details/shop-details.service'
import { NotificationService } from 'src/modules/notification/notification.service'
import { ShopifyInstallationGuard } from 'src/common/guards/shopify-installation.guard'
import { REQUIRED_ACCESS_SCOPES } from 'src/modules/access-scope/access-scope.constants'
import { AffiliateCodeService } from 'src/modules/affiliate-code/affiliate-code.service'
import { Controller, Get, Query, BadRequestException, Res, UseGuards, HttpService, Req } from '@nestjs/common'
import {
  WEBHOOK_PATH_ORDER_CREATED,
  WEBHOOK_PATH_SUBSCRIPTION_UPDATED,
  WEBHOOK_PATH_UNINSTALLED
} from 'src/modules/webhook/webhook.constants'

@Controller('installation')
export class InstallationController {
  constructor(
    private readonly httpService: HttpService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly webhookService: WebhookService,
    private readonly affiliateService: AffiliateService,
    private readonly shopDetailsService: ShopDetailsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly notificationService: NotificationService,
    private readonly affiliateCodeService: AffiliateCodeService
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
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') authCode: string,
    @Query('shop') shopOrigin: string
  ) {
    let user = await this.userService.findOne({ shopOrigin })
    const newSignup = user ? false : true
    user = user || (await this.userService.create({ shopOrigin }))
    const accessToken = await this.fetchAccessToken(shopOrigin, authCode)
    user.uninstalled = false
    user.accessToken = accessToken
    const shopDetails = await this.shopDetailsService.find(user)
    user.email = shopDetails.email
    user.appUrl = shopDetails.appUrl
    user.timezone = shopDetails.timezone
    user.storeName = shopDetails.storeName
    user.shopifyPlan = shopDetails.shopifyPlan
    user.shopifyPlus = shopDetails.shopifyPlus
    user.currencyCode = shopDetails.currencyCode
    user.primaryDomain = shopDetails.primaryDomain
    user.developmentStore = shopDetails.developmentStore
    await user.save()
    if (newSignup) this.runNewUserTasks(user, req.cookies.affiliateCode)
    res.redirect(`${user.appUrl}/setup`)
  }

  @Get('setup')
  @UseGuards(EmbeddedAppGuard)
  async setup(@GetUser() user: User) {
    user = await this.userService.updateMonthlySalesRecords(user)
    await Promise.all([
      this.subscriptionService.sync(user),
      this.webhookService.create(user, 'ORDERS_CREATE', `/webhook/${WEBHOOK_PATH_ORDER_CREATED}`),
      this.webhookService.create(user, 'APP_UNINSTALLED', `/webhook/${WEBHOOK_PATH_UNINSTALLED}`),
      this.webhookService.create(user, 'APP_SUBSCRIPTIONS_UPDATE', `/webhook/${WEBHOOK_PATH_SUBSCRIPTION_UPDATED}`),
      this.cartService.create({ user: Types.ObjectId(user.id as string) })
    ])
    return user
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

  async runNewUserTasks(user: User, affiliateCode: string) {
    this.mailService.sendWithTemplate({
      to: user.email,
      from: Persona.Ryan,
      template: Template.Welcome,
      templateModel: { appUrl: user.appUrl }
    })
    if (affiliateCode) {
      const affiliateId = (await this.affiliateCodeService.findOne({ code: affiliateCode }))?.affiliate
      if (affiliateId) {
        const affiliate = await this.affiliateService.findById(affiliateId)
        if (affiliate) {
          user.affiliate = affiliateId
          user.affiliateCode = affiliateCode
          user.save()
          this.notificationService.sendAffiliateReferralNotification(affiliate, user)
        }
      }
    }
  }
}
