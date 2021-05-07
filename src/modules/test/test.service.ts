import { Timeout } from '@nestjs/schedule'
import { Injectable } from '@nestjs/common'
import { UserService } from 'src/modules/user/user.service'
import { SalesService } from 'src/modules/sales/sales.service'
import { ShopDetailsService } from 'src/modules/shop-details/shop-details.service'
import { SubscriptionService } from 'src/modules/subscription/subscription.service'

@Injectable()
export class TestService {
  constructor(
    private readonly userService: UserService,
    private readonly salesService: SalesService,
    private readonly shopDetailsService: ShopDetailsService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  // @Timeout(1000)
  async start() {
    const users = await this.userService.findAll({ uninstalled: false })
    console.log('Count: ' + users.length)
    for (const user of users) {
      try {
        console.log('User: ' + user.shopOrigin)
        const shopDetails = await this.shopDetailsService.find(user)
        user.email = shopDetails.email
        user.appUrl = shopDetails.appUrl
        user.timezone = shopDetails.timezone
        user.storeName = shopDetails.storeName
        user.shopifyPlan = shopDetails.shopifyPlan
        user.shopifyPlus = shopDetails.shopifyPlus
        user.currencyCode = shopDetails.currencyCode
        user.primaryDomain = shopDetails.primaryDomain
        user.developmentStore = shopDetails.developmentStore
        await user.save()
      } catch (err) {
        console.log('An error occurred')
      }
    }
  }
}
