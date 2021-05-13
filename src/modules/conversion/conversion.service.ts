import { flatten } from 'lodash'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'src/modules/user/schema/user.schema'
import { Order } from 'src/modules/order/schema/order.schema'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PopulatedConversion } from './schema/conversion.schema'
import { composeGid } from '@shopify/admin-graphql-api-utilities'
import { ProgressBarService } from 'src/modules/progress-bar/progress-bar.service'
import { NotificationService } from 'src/modules/notification/notification.service'
import { FilterQuery, LeanDocument, PaginateModel, PaginateOptions, Types } from 'mongoose'
import { Conversion, ConversionType } from 'src/modules/conversion/schema/conversion.schema'
import { CrossSellImpressionService } from 'src/modules/event/modules/cross-sell-impression/cross-sell-impression.service'

@Injectable()
export class ConversionService {
  constructor(
    @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
    @InjectModel(Conversion.name) private readonly conversionModel: PaginateModel<Conversion>,
    private readonly crossSellImpressionService: CrossSellImpressionService,
    private readonly progressBarService: ProgressBarService
  ) {}

  create(data: Partial<Conversion>) {
    const conversion = new this.conversionModel(data)
    return conversion.save()
  }

  findAll(query: FilterQuery<Conversion> = {}) {
    return this.conversionModel.find(query)
  }

  findByOffer(
    userId: string,
    offerId: string,
    conversionType: ConversionType,
    options: PaginateOptions = { page: 1, limit: 20 }
  ) {
    const query = { user: userId, type: conversionType, object: offerId }
    return this.conversionModel.paginate(query, options)
  }

  async trackConversions(order: Order, user: User) {
    const orderNumber = order.details.order_number
    const conversions = flatten(
      await Promise.all([this.trackCrossSellConversions(order, user), this.trackProgressBarConversions(order, user)])
    )
    this.notificationService.sendConversionNotification(conversions as PopulatedConversion[], orderNumber)
  }

  async trackCrossSellConversions(order: Order, user: User) {
    const cartToken = order.details.cart_token
    const lineItems = order.details.line_items
    const conversions: LeanDocument<Conversion>[] = []
    const crossSellImpressions = await this.crossSellImpressionService.findAll({ cartToken })
    for (const lineItem of lineItems) {
      const productId = composeGid('Product', lineItem.product_id)
      const convertedCrossSell = crossSellImpressions.find(({ crossSell }) => crossSell.productId === productId)
        ?.crossSell
      if (!convertedCrossSell) continue
      conversions.push({
        order: Types.ObjectId(order.id),
        type: ConversionType.CrossSell,
        user: Types.ObjectId(user.id),
        value: parseFloat(lineItem.price) * lineItem.quantity,
        object: Types.ObjectId(convertedCrossSell.id)
      })
    }
    return Promise.all(conversions.map(conversion => this.create(conversion)))
  }

  async trackProgressBarConversions(order: Order, user: User) {
    const subtotal = parseFloat(order.details.subtotal_price)
    const conversions: LeanDocument<Conversion>[] = []
    const activeProgressBars = (
      await this.progressBarService.findAll({ active: true, user: user.id }, { limit: Number.MAX_SAFE_INTEGER })
    ).docs
    const convertedProgressBars = activeProgressBars.filter(progressBar => subtotal >= progressBar.goal)
    for (const convertedProgressBar of convertedProgressBars) {
      conversions.push({
        order: Types.ObjectId(order.id),
        type: ConversionType.ProgressBar,
        user: Types.ObjectId(user.id),
        object: Types.ObjectId(convertedProgressBar.id)
      })
    }
    return Promise.all(conversions.map(conversion => this.create(conversion)))
  }
}
