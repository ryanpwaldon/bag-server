import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery, LeanDocument } from 'mongoose'
import { OrderCreated } from './schema/order-created.schema'

@Injectable()
export class OrderCreatedService {
  constructor(
    @InjectModel(OrderCreated.name)
    private readonly orderCreatedModel: Model<OrderCreated>
  ) {}

  create(data: LeanDocument<OrderCreated>) {
    new this.orderCreatedModel(data).save()
  }

  count(query: FilterQuery<OrderCreated>) {
    return this.orderCreatedModel.countDocuments(query)
  }
}
