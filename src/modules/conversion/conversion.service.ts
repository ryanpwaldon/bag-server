import { Model, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'src/modules/user/schema/user.schema'
import { composeGid } from '@shopify/admin-graphql-api-utilities'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { Conversion } from 'src/modules/conversion/schema/conversion.schema'
import { OrderCreatedEvent } from 'src/modules/order/interface/order-created-event.interface'
import { CrossSellImpressionService } from 'src/modules/event/modules/cross-sell-impression/cross-sell-impression.service'

@Injectable()
export class ConversionService {
  constructor(
    @InjectModel(Conversion.name) private readonly conversionModel: Model<Conversion>,
    private readonly crossSellImpressionService: CrossSellImpressionService
  ) {}

  create(data: Partial<Conversion>) {
    const conversion = new this.conversionModel(data)
    return conversion.save()
  }

  async trackConversions(order: OrderCreatedEvent, user: User) {
    const cartToken = order.cart_token
    const lineItems = order.line_items
    const orderId = composeGid('Order', order.id)
    // track cross-sell conversions
    const crossSellImpressions = await this.crossSellImpressionService.findAll({ cartToken })
    for (const lineItem of lineItems) {
      const productId = composeGid('Product', lineItem.product_id)
      const convertedCrossSell = crossSellImpressions.find(({ crossSell }) => crossSell.productId === productId)
      if (convertedCrossSell) {
        this.create({
          user: Types.ObjectId(user.id),
          offerModel: CrossSell.name,
          offer: Types.ObjectId(convertedCrossSell.id),
          value: parseFloat(lineItem.price),
          orderId
        })
      }
    }
  }
}
