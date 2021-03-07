import { Types } from 'mongoose'
import { Order } from 'src/common/types/order'
import { User } from 'src/common/decorators/user.decorator'
import { CartService } from 'src/modules/cart/cart.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { ShopifyWebhookGuard } from 'src/common/guards/shopify-webhook.guard'
import { SubscriptionService } from 'src/modules/subscription/subscription.service'
import { OrderCreatedService } from 'src/modules/event/modules/order-created/order-created.service'
import {
  WEBHOOK_PATH_ORDER_CREATED,
  WEBHOOK_PATH_SUBSCRIPTION_UPDATED,
  WEBHOOK_PATH_UNINSTALLED
} from 'src/modules/webhook/webhook.constants'

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly cartService: CartService,
    private readonly conversionService: ConversionService,
    private readonly orderCreatedService: OrderCreatedService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Post(WEBHOOK_PATH_SUBSCRIPTION_UPDATED)
  @UseGuards(ShopifyWebhookGuard)
  subscriptionUpdated(@User() user: UserType) {
    this.subscriptionService.sync(user)
  }

  @Post(WEBHOOK_PATH_ORDER_CREATED)
  @UseGuards(ShopifyWebhookGuard)
  async orderCreated(@Body() order: Order, @User() user: UserType) {
    this.orderCreatedService.create({ user: Types.ObjectId(user.id) })
    this.conversionService.trackConversions(order, user)
  }

  @Post(WEBHOOK_PATH_UNINSTALLED)
  @UseGuards(ShopifyWebhookGuard)
  async uninstalled(@User() user: UserType) {
    user.uninstalled = true
    user.subscription = undefined
    user.save()
    const cart = await this.cartService.findOneByUserId(user.id)
    if (!cart) return
    cart.active = false
    cart.save()
  }
}
