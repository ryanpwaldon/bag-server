import { CreateCartEventDto } from 'src/modules/cart-event/dto/create-cart-event.dto'
import { CartEvent } from 'src/modules/cart-event/schema/cart-event.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Model, MongooseFilterQuery } from 'mongoose'

@Injectable()
export class CartEventService {
  constructor(@InjectModel(CartEvent.name) private readonly cartEventModel: Model<CartEvent>) {}

  create(createCartEventDto: CreateCartEventDto) {
    new this.cartEventModel(createCartEventDto).save()
  }

  findAll(query: MongooseFilterQuery<CartEvent>) {
    return this.cartEventModel.find(query)
  }
}
