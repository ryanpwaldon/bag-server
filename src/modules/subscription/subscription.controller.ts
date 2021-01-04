import { Response } from 'express'
import { User } from 'src/common/decorators/user.decorator'
import { SubscriptionService } from './subscription.service'
import { AppUrlService } from 'src/modules/app-url/app-url.service'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { PAID_SUBSCRIPTION_CREATED_PATH } from './subscription.constants'
import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common'
import { ShopifyRedirectGuard } from 'src/common/guards/shopify-redirect.guard'

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly appUrlService: AppUrlService
  ) {}

  @Post('free')
  @UseGuards(EmbeddedAppGuard)
  createFreeSubscription(@User() user: UserType, @Body('subscriptionName') subscriptionName: string) {
    return this.subscriptionService.createFreeSubscription(user, subscriptionName)
  }

  @Post('paid')
  @UseGuards(EmbeddedAppGuard)
  createPaidSubscription(@User() user: UserType, @Body('subscriptionName') subscriptionName: string) {
    return this.subscriptionService.createPaidSubscription(user, subscriptionName)
  }

  @Get(PAID_SUBSCRIPTION_CREATED_PATH)
  @UseGuards(ShopifyRedirectGuard)
  async paidSubscriptionCreated(@User() user: UserType, @Res() res: Response) {
    const appUrl = await this.appUrlService.find()
    await this.subscriptionService.sync(user)
    res.redirect(appUrl)
  }

  @Get('sync')
  @UseGuards(EmbeddedAppGuard)
  sync(@User() user: UserType) {
    return this.subscriptionService.sync(user)
  }

  @Get('cancel')
  @UseGuards(EmbeddedAppGuard)
  cancel(@User() user: UserType) {
    this.subscriptionService.cancel(user)
  }

  @Get()
  @UseGuards(EmbeddedAppGuard)
  findAll() {
    return this.subscriptionService.findAll()
  }
}
