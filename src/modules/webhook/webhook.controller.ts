import { Types } from 'mongoose'
import { AdminOrder } from 'src/common/types/admin-order'
import { User } from 'src/modules/user/schema/user.schema'
import { Template } from 'src/modules/mail/types/template'
import { CartService } from 'src/modules/cart/cart.service'
import { GetUser } from 'src/common/decorators/user.decorator'
import { OrderService } from 'src/modules/order/order.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { MailService, Persona } from 'src/modules/mail/mail.service'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { ShopifyWebhookGuard } from 'src/common/guards/shopify-webhook.guard'
import { SubscriptionService } from 'src/modules/subscription/subscription.service'
import {
  WEBHOOK_PATH_ORDER_CREATED,
  WEBHOOK_PATH_SUBSCRIPTION_UPDATED,
  WEBHOOK_PATH_UNINSTALLED
} from 'src/modules/webhook/webhook.constants'

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly mailService: MailService,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly conversionService: ConversionService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Post(WEBHOOK_PATH_SUBSCRIPTION_UPDATED)
  @UseGuards(ShopifyWebhookGuard)
  subscriptionUpdated(@GetUser() user: User) {
    this.subscriptionService.sync(user)
  }

  @Post(WEBHOOK_PATH_ORDER_CREATED)
  @UseGuards(ShopifyWebhookGuard)
  async orderCreated(@Body() adminOrder: AdminOrder, @GetUser() user: User) {
    const order = await this.orderService.create({ user: Types.ObjectId(user.id), details: adminOrder })
    const cart = await this.cartService.findOneByUserId(user.id)
    if (!cart?.active) return
    this.conversionService.trackConversions(order, user)
  }

  @Post(WEBHOOK_PATH_UNINSTALLED)
  @UseGuards(ShopifyWebhookGuard)
  async uninstalled(@GetUser() user: User) {
    user.uninstalled = true
    user.subscription = undefined
    user.save()
    const cart = await this.cartService.findOneByUserId(user.id)
    if (!cart) return
    cart.active = false
    cart.save()
    this.mailService.sendWithTemplate({ to: user.email, from: Persona.Ryan, template: Template.Uninstalled })
  }
}
