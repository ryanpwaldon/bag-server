import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, MongooseFilterQuery } from 'mongoose'
import { Cart } from 'src/modules/cart/schema/cart.schema'

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {}

  create(body: Partial<Cart>) {
    new this.cartModel(body).save()
  }

  findAll(query: MongooseFilterQuery<Cart>) {
    return this.cartModel.find(query)
  }
}
