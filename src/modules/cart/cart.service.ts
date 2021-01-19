import { Model } from 'mongoose'
import assign from 'lodash/assign'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { Cart } from 'src/modules/cart/schema/cart.schema'
import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto'
import { ScriptTagService } from 'src/modules/script-tag/script-tag.service'

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly scriptTagService: ScriptTagService,
    private readonly configService: ConfigService
  ) {}

  async create(createCartDto: CreateCartDto) {
    const cart = await this.cartModel.findOne(createCartDto)
    return cart || new this.cartModel(createCartDto).save()
  }

  findOneByUserId(userId: string) {
    return this.cartModel.findOne({ user: userId })
  }

  async updateOneByUserId(userId: string, body: Partial<Cart>): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId })
    if (!cart) throw new BadRequestException('Cart ID does not exist.')
    assign(cart, body)
    if (cart.active) await this.scriptTagService.createOrUpdate(this.buildScriptTagUrl())
    else await this.scriptTagService.delete()
    return cart.save()
  }

  buildScriptTagUrl() {
    return this.configService.get('PLUGIN_SCRIPT_URL')
  }
}
