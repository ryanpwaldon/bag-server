import { Model } from 'mongoose'
import assign from 'lodash/assign'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { Cart } from 'src/modules/cart/schema/cart.schema'
import { User } from 'src/modules/user/schema/user.schema'
import { ThemeService } from 'src/modules/theme/theme.service'
import { AssetService } from 'src/modules/asset/asset.service'
import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto'
import { ScriptTagService } from 'src/modules/script-tag/script-tag.service'
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly scriptTagService: ScriptTagService,
    private readonly configService: ConfigService,
    private readonly themeService: ThemeService,
    private readonly assetService: AssetService
  ) {}

  async create(createCartDto: CreateCartDto) {
    const cart = await this.cartModel.findOne(createCartDto)
    return cart || new this.cartModel(createCartDto).save()
  }

  findOneByUserId(userId?: string) {
    return this.cartModel.findOne({ user: userId })
  }

  async updateOneByUserId(user: User, body: Partial<Cart>): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: user.id })
    if (!cart) throw new BadRequestException('Cart ID does not exist.')
    assign(cart, body)
    if (cart.isModified('active')) {
      if (cart.active) {
        await this.updateThemeFiles(user)
        await this.scriptTagService.createOrUpdate(user, this.configService.get('BLANK_SCRIPT_URL') as string)
      } else await this.scriptTagService.delete(user)
    }
    return cart.save()
  }

  async updateThemeFiles(user: User) {
    const pluginHost = this.configService.get('PLUGIN_HOST') as string
    const appLiquidKey = this.configService.get('APP_LIQUID_KEY') as string
    const themeLiquidKey = this.configService.get('THEME_LIQUID_KEY') as string
    const appLiquidValue = this.configService.get('APP_LIQUID_VALUE') as string
    const themeLiquidTrigger = this.configService.get('THEME_LIQUID_TRIGGER') as string
    const theme = await this.themeService.findMain(user)
    const themeLiquid = await this.assetService.findOne(user, theme.id, themeLiquidKey)
    const triggerExists = themeLiquid.value.includes(pluginHost)
    if (!triggerExists) {
      const target = '</head>'
      const occurrences = themeLiquid.value.match(new RegExp(target, 'g'))?.length
      if (occurrences !== 1) throw new InternalServerErrorException('Insert trigger error.')
      const value = themeLiquid.value.replace(target, `${themeLiquidTrigger}${target}`)
      await this.assetService.createOrUpdate(user, theme.id, themeLiquidKey, value)
    }
    await this.assetService.createOrUpdate(user, theme.id, appLiquidKey, appLiquidValue)
  }
}
