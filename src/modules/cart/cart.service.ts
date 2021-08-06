import assign from 'lodash/assign'
import { LeanDocument, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { Cart } from 'src/modules/cart/schema/cart.schema'
import { User } from 'src/modules/user/schema/user.schema'
import { ThemeService } from 'src/modules/theme/theme.service'
import { AssetService } from 'src/modules/asset/asset.service'
import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto'
import { ScriptTagService } from 'src/modules/script-tag/script-tag.service'
import generateAppFileContent from 'src/common/utils/generateAppFileContent'
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

  async updateOneByUserId(user: User, body: LeanDocument<Cart>): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: user.id })
    if (!cart) throw new BadRequestException('Cart ID does not exist.')
    assign(cart, body)
    if (cart.isModified()) {
      if (cart.isModified('active')) {
        if (cart.active) {
          await this.scriptTagService.createOrUpdate(user, this.configService.get('BLANK_SCRIPT_URL') as string)
        } else {
          await this.scriptTagService.delete(user)
        }
      }
      await this.updateThemeFiles(user, cart)
    }
    return cart.save()
  }

  async updateThemeFiles(user: User, cart: Cart) {
    const pluginHost = this.configService.get('PLUGIN_HOST') as string
    const appFilePath = this.configService.get('APP_FILE_PATH') as string
    const startScriptUrl = this.configService.get('START_SCRIPT_URL') as string
    const themeFilePath = this.configService.get('THEME_FILE_PATH') as string
    const appFileContent = generateAppFileContent(startScriptUrl, cart.cartSettings)
    const themeFileSnippet = this.configService.get('THEME_FILE_SNIPPET') as string
    const theme = await this.themeService.findMain(user)
    const themeFileContent = await this.assetService.findOne(user, theme.id, themeFilePath)
    const snippetExists = themeFileContent.value.includes(pluginHost)
    if (!snippetExists) {
      const target = '</head>'
      const occurrences = themeFileContent.value.match(new RegExp(target, 'g'))?.length
      if (occurrences !== 1) throw new InternalServerErrorException('Insert trigger error.')
      const value = themeFileContent.value.replace(target, `${themeFileSnippet}${target}`)
      await this.assetService.createOrUpdate(user, theme.id, themeFilePath, value)
    }
    await this.assetService.createOrUpdate(user, theme.id, appFilePath, appFileContent)
  }
}
