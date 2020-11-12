import { OrderCreatedEvent } from 'src/modules/order/interface/order-created-event.interface'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { CartEventService } from 'src/modules/cart-event/cart-event.service'
import { CrossSellService } from 'src/modules/cross-sell/cross-sell.service'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { composeGid } from '@shopify/admin-graphql-api-utilities'
import { OrderService } from 'src/modules/order/order.service'
import { Roles } from 'src/common/decorators/role.decorator'
import { Role } from 'src/common/constants/role.constants'
import { RoleGuard } from 'src/common/guards/role.guard'

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly crossSellService: CrossSellService,
    private readonly cartEventService: CartEventService
  ) {}

  @Get('ids')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findByIds(@Query('ids') ids: string[]) {
    return this.orderService.findByIds(ids)
  }

  @Post('event/created')
  async onCreated(@Body() orderCreatedEvent: OrderCreatedEvent) {
    const orderId = composeGid('Order', orderCreatedEvent.id)
    const cartToken = orderCreatedEvent.cart_token
    const cartEvents = await this.cartEventService.findAll({ cartToken })
    const purchasedProductIds = orderCreatedEvent.line_items.map(item => composeGid('Product', item.product_id))
    const convertedCrossSellIds = cartEvents
      .filter(item => 'productId' in item.meta && purchasedProductIds.includes(item.meta.productId))
      .map(item => 'productId' in item.meta && item.meta.crossSellId) as string[]
    const convertedCrossSells = (
      await Promise.all(convertedCrossSellIds.map(id => this.crossSellService.findOneById(id)))
    ).filter(item => !!item) as CrossSell[]
    convertedCrossSells.map(item => {
      item.orders = [...new Set([...item.orders, orderId])]
      return item.save()
    })
  }
}
