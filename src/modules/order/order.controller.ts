import { ConversionService } from 'src/modules/conversion/conversion.service'
import { OrderCreatedEvent } from 'src/modules/order/interface/order-created-event.interface'
import { CrossSellImpressionService } from 'src/modules/event/modules/cross-sell-impression/cross-sell-impression.service'
import { Body, Controller, Get, Headers, Post, Query, UseGuards } from '@nestjs/common'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { composeGid } from '@shopify/admin-graphql-api-utilities'
import { OrderService } from 'src/modules/order/order.service'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserService } from 'src/modules/user/user.service'
import { Role } from 'src/common/constants/role.constants'
import { RoleGuard } from 'src/common/guards/role.guard'
import { Types } from 'mongoose'

@Controller('order')
export class OrderController {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly crossSellImpressionService: CrossSellImpressionService,
    private readonly conversionService: ConversionService
  ) {}

  @Get('ids')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findByIds(@Query('ids') ids: string[] | undefined) {
    if (!ids?.length) return []
    return this.orderService.findByIds(ids)
  }

  // // webhook
  @Post('created')
  async onCreated(@Body() orderCreatedEvent: OrderCreatedEvent, @Headers('x-shopify-shop-domain') shopOrigin: string) {
    const user = await this.userService.findOne({ shopOrigin })
    const orderId = composeGid('Order', orderCreatedEvent.id)
    const cartToken = orderCreatedEvent.cart_token
    const lineItems = orderCreatedEvent.line_items
    // track cross-sell conversions
    const crossSellImpressions = await this.crossSellImpressionService.findAll({ cartToken })
    for (const lineItem of lineItems) {
      const productId = composeGid('Product', lineItem.product_id)
      const convertedCrossSell = crossSellImpressions.find(({ crossSell }) => crossSell.productId === productId)
      if (convertedCrossSell) {
        this.conversionService.create({
          user: Types.ObjectId(user?.id),
          offerModel: CrossSell.name,
          offer: Types.ObjectId(convertedCrossSell.id),
          value: parseFloat(lineItem.price),
          orderId
        })
      }
    }
  }
}
