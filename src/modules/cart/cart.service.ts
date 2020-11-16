import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, MongooseFilterQuery } from 'mongoose'
import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto'
import { Cart } from 'src/modules/cart/schema/cart.schema'

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {}

  async create(createCartDto: CreateCartDto) {
    const cart = await this.cartModel.findOne(createCartDto)
    return cart || new this.cartModel(createCartDto).save()
  }

  findAll(query: MongooseFilterQuery<Cart>) {
    return this.cartModel.find(query)
  }
}
