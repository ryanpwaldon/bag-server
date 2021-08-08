import { Injectable } from '@nestjs/common'
import { User } from 'src/modules/user/schema/user.schema'
import { UserService } from 'src/modules/user/user.service'
import { ProductService } from 'src/modules/product/product.service'
import { CrossSellService } from 'src/modules/cross-sell/cross-sell.service'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { ProgressBarService } from 'src/modules/progress-bar/progress-bar.service'

const logFail = (message: string) => console.log(`Fail: ${message}`)
const logSuccess = (message: string) => console.log(`Success: ${message}`)

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly crossSellService: CrossSellService,
    private readonly conversionService: ConversionService,
    private readonly progressBarService: ProgressBarService
  ) {}

  // delete all data related to uninstalled users (except for the user object)
  async deleteUninstalledUserData() {
    const users = (await this.userService.findAll({}, 1, Number.MAX_SAFE_INTEGER)).docs
    for (const user of users) {
      if (user.uninstalled) {
        try {
          const crossSells = (
            await this.crossSellService.findAll({ user: user.id }, { page: 1, limit: Number.MAX_SAFE_INTEGER })
          ).docs
          const conversions = await this.conversionService.findAll({ user: user.id })
          const progressBars = (
            await this.progressBarService.findAll({ user: user.id }, { page: 1, limit: Number.MAX_SAFE_INTEGER })
          ).docs
        } catch (err) {
          //
        }
      }
    }
  }

  async addProductNamesToCrossSells() {
    const response = await this.crossSellService.findAll({}, { page: 1, limit: Number.MAX_SAFE_INTEGER, populate: 'user' }) // prettier-ignore
    const crossSells = response.docs
    for (const crossSell of crossSells) {
      const productId = crossSell.productId
      const user = (crossSell.user as unknown) as User
      if (!user) {
        logFail('User does not exist in database.')
        continue
      }
      if (user.uninstalled) {
        logFail('User has uninstalled the app.')
        continue
      }
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)) // wait 1 second
        const product = await this.productService.findOneById(user, productId)
        if (!product) {
          logFail('Product could not be found.')
          continue
        }
        logSuccess(product.title)
      } catch (err) {
        logFail(`\nUser: ${user.shopOrigin}\nCross Sell: ${crossSell.id}\nError: ${err}`)
      }
    }
  }
}
