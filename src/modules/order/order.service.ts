import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { LeanDocument, Model } from 'mongoose'
import { Order } from 'src/modules/order/schema/order.schema'
import { DateRange } from 'src/modules/progress-bar/progress-bar.types'

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {}

  create(data: LeanDocument<Order>) {
    return new this.orderModel(data).save()
  }

  countByDateRanges(dateRanges: DateRange[], userId: string) {
    const query = {
      user: userId,
      $or: dateRanges.map(({ start, end }) => ({ createdAt: { $gte: start, $lt: end } }))
    }
    return this.orderModel.countDocuments(query)
  }
}
