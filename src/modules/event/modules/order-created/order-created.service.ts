import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, LeanDocument } from 'mongoose'
import { OrderCreated } from './schema/order-created.schema'
import { DateRange } from 'src/modules/progress-bar/progress-bar.types'

@Injectable()
export class OrderCreatedService {
  constructor(
    @InjectModel(OrderCreated.name)
    private readonly orderCreatedModel: Model<OrderCreated>
  ) {}

  create(data: LeanDocument<OrderCreated>) {
    new this.orderCreatedModel(data).save()
  }

  countByDateRanges(dateRanges: DateRange[]) {
    const query = { $or: dateRanges.map(({ start, end }) => ({ createdAt: { $gte: start, $lt: end } })) }
    return this.orderCreatedModel.countDocuments(query)
  }
}
