import { FilterQuery, Model, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Order } from 'src/common/types/order'
import { User } from 'src/modules/user/schema/user.schema'
import { composeGid } from '@shopify/admin-graphql-api-utilities'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { Conversion } from 'src/modules/conversion/schema/conversion.schema'
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

  findAll(query: FilterQuery<Conversion>) {
    return this.conversionModel.find(query)
  }

  findByCrossSellId(userId: string, crossSellId: string) {
    return this.conversionModel.find({ user: userId, type: CrossSell.name, object: crossSellId })
  }

  async trackCrossSellConversions(order: Order, user: User) {
    const cartToken = order.cart_token
    const lineItems = order.line_items
    const crossSellImpressions = await this.crossSellImpressionService.findAll({ cartToken })
    for (const lineItem of lineItems) {
      const productId = composeGid('Product', lineItem.product_id)
      const convertedCrossSell = crossSellImpressions.find(({ crossSell }) => crossSell.productId === productId)
        ?.crossSell
      if (convertedCrossSell) {
        this.create({
          order,
          type: CrossSell.name,
          user: Types.ObjectId(user.id),
          value: parseFloat(lineItem.price),
          object: Types.ObjectId(convertedCrossSell.id)
        })
      }
    }
  }
}
