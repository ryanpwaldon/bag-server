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
import { CrossSellClickService } from 'src/modules/event/modules/cross-sell-click/cross-sell-click.service'

@Injectable()
export class ConversionService {
  constructor(
    @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
    @InjectModel(Conversion.name) private readonly conversionModel: PaginateModel<Conversion>,
    private readonly crossSellClickService: CrossSellClickService,
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

  async getCrossSellIncome(userId: string, offerId: string) {
    return (
      await this.conversionModel.aggregate([
        { $match: { user: Types.ObjectId(userId), object: Types.ObjectId(offerId), type: ConversionType.CrossSell } },
        { $group: { _id: null, value: { $sum: '$value' } } }
      ])
    )[0]?.value
  }

  async getTotalCountByOffer(userId: string, offerId: string, conversionType: ConversionType) {
    return this.conversionModel.countDocuments({ user: userId, object: offerId, type: conversionType })
  }

  async trackConversions(order: Order, user: User) {
    const orderNumber = order.details.order_number
    const crossSellConversions = await this.trackCrossSellConversions(order, user)
    const progressBarConversions = await this.trackProgressBarConversions(order, user)
    let conversions = [...crossSellConversions, ...progressBarConversions]
    conversions = await Promise.all(conversions.map(conversion => conversion.populate('user').populate('object').populate('order').execPopulate())) // prettier-ignore
    this.notificationService.sendConversionNotification(conversions as PopulatedConversion[], orderNumber)
  }

  async trackCrossSellConversions(order: Order, user: User) {
    const cartToken = order.details.cart_token
    const lineItems = order.details.line_items
    const conversions: LeanDocument<Conversion>[] = []
    const crossSellClicks = await this.crossSellClickService.findAll({ cartToken })
    for (const lineItem of lineItems) {
      const productId = composeGid('Product', lineItem.product_id)
      const convertedCrossSell = crossSellClicks.find(({ crossSell }) => crossSell.productId === productId)?.crossSell
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
