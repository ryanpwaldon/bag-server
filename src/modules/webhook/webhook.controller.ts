import { User } from 'src/common/decorators/user.decorator'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { ShopifyWebhookGuard } from 'src/common/guards/shopify-webhook.guard'
import { SubscriptionService } from 'src/modules/subscription/subscription.service'
import { OrderCreatedEvent } from 'src/modules/order/interface/order-created-event.interface'
import { ConversionService } from 'src/modules/conversion/conversion.service'

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly conversionService: ConversionService
  ) {}

  @Post('subscription-updated')
  @UseGuards(ShopifyWebhookGuard)
  subscriptionUpdated() {
    this.subscriptionService.sync()
  }

  @Post('order-created')
  @UseGuards(ShopifyWebhookGuard)
  async orderCreated(@Body() order: OrderCreatedEvent, @User() user: UserType) {
    this.conversionService.trackConversions(order, user)
  }

  @Post('uninstalled')
  @UseGuards(ShopifyWebhookGuard)
  async uninstalled(@User() user: UserType) {
    user.uninstalled = true
    user.onboarded = false
    user.save()
  }
}
