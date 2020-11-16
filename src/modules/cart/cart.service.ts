import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto'
import { Cart } from 'src/modules/cart/schema/cart.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Model, Schema } from 'mongoose'
import assign from 'lodash/assign'

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {}

  async create(createCartDto: CreateCartDto) {
    const cart = await this.cartModel.findOne(createCartDto)
    return cart || new this.cartModel(createCartDto).save()
  }

  findOneByUserId(userId: Schema.Types.ObjectId) {
    return this.cartModel.findOne({ user: userId })
  }

  async updateOneByUserId(userId: Schema.Types.ObjectId, body: Partial<Cart>): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId })
    return assign(cart, body).save()
  }
}
