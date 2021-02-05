import { InjectModel } from '@nestjs/mongoose'
import { Order } from 'src/common/types/order'
import { User } from 'src/modules/user/schema/user.schema'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { composeGid } from '@shopify/admin-graphql-api-utilities'
import { FilterQuery, LeanDocument, Model, Types } from 'mongoose'
import { NotificationService } from 'src/modules/notification/notification.service'
import { Conversion, ConversionType } from 'src/modules/conversion/schema/conversion.schema'
import { CrossSellImpressionService } from 'src/modules/event/modules/cross-sell-impression/cross-sell-impression.service'

@Injectable()
export class ConversionService {
  constructor(
    @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
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
    return this.conversionModel.find({ user: userId, type: ConversionType.CrossSell, object: crossSellId })
  }

  async trackConversions(order: Order, user: User) {
    const cartToken = order.cart_token
    const lineItems = order.line_items
    const conversions: LeanDocument<Conversion>[] = []
    const crossSellImpressions = await this.crossSellImpressionService.findAll({ cartToken })
    for (const lineItem of lineItems) {
      const productId = composeGid('Product', lineItem.product_id)
      const convertedCrossSell = crossSellImpressions.find(({ crossSell }) => crossSell.productId === productId)
        ?.crossSell
      if (!convertedCrossSell) continue
      conversions.push({
        order,
        type: ConversionType.CrossSell,
        user: Types.ObjectId(user.id),
        value: parseFloat(lineItem.price) * lineItem.quantity,
        object: Types.ObjectId(convertedCrossSell.id)
      })
    }
    conversions.forEach(conversion => this.create(conversion))
    this.notificationService.sendConversionNotification(user, conversions)
  }
}
