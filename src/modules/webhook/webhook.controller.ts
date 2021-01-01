import { User } from 'src/common/decorators/user.decorator'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { ShopifyWebhookGuard } from 'src/common/guards/shopify-webhook.guard'
import { SubscriptionService } from 'src/modules/subscription/subscription.service'
import { OrderCreatedEvent } from 'src/modules/order/interface/order-created-event.interface'
import {
  WEBHOOK_PATH_ORDER_CREATED,
  WEBHOOK_PATH_SUBSCRIPTION_UPDATED,
  WEBHOOK_PATH_UNINSTALLED
} from 'src/modules/webhook/webhook.constants'

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly conversionService: ConversionService
  ) {}

  @Post(WEBHOOK_PATH_SUBSCRIPTION_UPDATED)
  @UseGuards(ShopifyWebhookGuard)
  subscriptionUpdated(@User() user: UserType) {
    this.subscriptionService.sync(user)
  }

  @Post(WEBHOOK_PATH_ORDER_CREATED)
  @UseGuards(ShopifyWebhookGuard)
  async orderCreated(@Body() order: OrderCreatedEvent, @User() user: UserType) {
    this.conversionService.trackConversions(order, user)
  }

  @Post(WEBHOOK_PATH_UNINSTALLED)
  @UseGuards(ShopifyWebhookGuard)
  async uninstalled(@User() user: UserType) {
    user.uninstalled = true
    user.onboarded = false
    user.save()
  }
}
