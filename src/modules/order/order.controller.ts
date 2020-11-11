import { Body, Controller, Post } from '@nestjs/common'
import { OrderCreatedEvent } from 'src/modules/order/interface/order-created-event.interface'
import { CartEventService } from 'src/modules/cart-event/cart-event.service'
import { CrossSellService } from 'src/modules/cross-sell/cross-sell.service'
import { composeGid } from '@shopify/admin-graphql-api-utilities'

@Controller('order')
export class OrderController {
  constructor(
    private readonly crossSellService: CrossSellService,
    private readonly cartEventService: CartEventService
  ) {}

  @Post('event/created')
  async onCreated(@Body() orderCreatedEvent: OrderCreatedEvent) {
    const orderId = composeGid('Order', orderCreatedEvent.id)
    const cartToken = orderCreatedEvent.cart_token
    const cartEvents = await this.cartEventService.findAll({ cartToken })
    const purchasedProductIds = orderCreatedEvent.line_items.map(item => composeGid('Product', item.product_id))
    const convertedCrossSellIds = cartEvents
      .filter(item => 'productId' in item.meta && purchasedProductIds.includes(item.meta.productId))
      .map(item => 'productId' in item.meta && item.meta.crossSellId) as string[]
    convertedCrossSellIds.map(id => this.crossSellService.updateOneById(id, { $addToSet: { orders: orderId } }))
  }
}
