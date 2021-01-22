import { Model } from 'mongoose'
import assign from 'lodash/assign'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { Cart } from 'src/modules/cart/schema/cart.schema'
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

  async updateOneByUserId(userId: string, body: Partial<Cart>): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId })
    if (!cart) throw new BadRequestException('Cart ID does not exist.')
    assign(cart, body)
    if (cart.isModified('active')) {
      if (cart.active) {
        await this.updateThemeFiles()
        await this.scriptTagService.createOrUpdate(this.configService.get('BLANK_SCRIPT_URL') as string)
      } else await this.scriptTagService.delete()
    }
    return cart.save()
  }

  async updateThemeFiles() {
    const pluginHost = this.configService.get('PLUGIN_HOST') as string
    const appLiquidKey = this.configService.get('APP_LIQUID_KEY') as string
    const themeLiquidKey = this.configService.get('THEME_LIQUID_KEY') as string
    const appLiquidValue = this.configService.get('APP_LIQUID_VALUE') as string
    const themeLiquidTrigger = this.configService.get('THEME_LIQUID_TRIGGER') as string
    const theme = await this.themeService.findMain()
    const themeLiquid = await this.assetService.findOne(theme.id, themeLiquidKey)
    const triggerExists = themeLiquid.value.includes(pluginHost)
    if (!triggerExists) {
      const target = '</head>'
      const occurrences = themeLiquid.value.match(new RegExp(target, 'g'))?.length
      if (occurrences !== 1) throw new InternalServerErrorException('Insert trigger error.')
      const value = themeLiquid.value.replace(target, `${themeLiquidTrigger}${target}`)
      await this.assetService.createOrUpdate(theme.id, themeLiquidKey, value)
    }
    await this.assetService.createOrUpdate(theme.id, appLiquidKey, appLiquidValue)
  }
}
