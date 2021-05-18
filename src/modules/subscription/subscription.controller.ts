import { Response } from 'express'
import { GetUser } from 'src/common/decorators/user.decorator'
import { SubscriptionService } from './subscription.service'
import { User } from 'src/modules/user/schema/user.schema'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { PAID_SUBSCRIPTION_CREATED_PATH } from './subscription.constants'
import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common'
import { ShopifyRedirectGuard } from 'src/common/guards/shopify-redirect.guard'

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('available')
  @UseGuards(EmbeddedAppGuard)
  findAllTiered() {
    return this.subscriptionService.findAllTiered()
  }

  @Get('suitable')
  @UseGuards(EmbeddedAppGuard)
  async findSuitableSubscriptionPair(@GetUser() user: User) {
    return this.subscriptionService.findSuitableSubscriptionPair(user)
  }

  @Post('free')
  @UseGuards(EmbeddedAppGuard)
  async createFreeSubscription(@GetUser() user: User, @Body('subscriptionName') subscriptionName: string) {
    await this.subscriptionService.cancel(user)
    return this.subscriptionService.createFreeSubscription(user, subscriptionName)
  }

  @Post('paid')
  @UseGuards(EmbeddedAppGuard)
  createPaidSubscription(@GetUser() user: User, @Body('subscriptionName') subscriptionName: string) {
    return this.subscriptionService.createPaidSubscription(user, subscriptionName)
  }

  @Get(PAID_SUBSCRIPTION_CREATED_PATH)
  @UseGuards(ShopifyRedirectGuard)
  async paidSubscriptionCreated(@GetUser() user: User, @Res() res: Response) {
    await this.subscriptionService.sync(user)
    res.redirect(user.appUrl)
  }

  @Get('sync')
  @UseGuards(EmbeddedAppGuard)
  sync(@GetUser() user: User) {
    return this.subscriptionService.sync(user)
  }

  @Get('cancel')
  @UseGuards(EmbeddedAppGuard)
  cancel(@GetUser() user: User) {
    return this.subscriptionService.cancel(user)
  }

  @Get('active')
  @UseGuards(EmbeddedAppGuard)
  findActiveSubscription(@GetUser() user: User) {
    return this.subscriptionService.findActiveSubscription(user)
  }
}
