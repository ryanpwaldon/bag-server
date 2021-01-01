import { ConfigService } from '@nestjs/config'
import { Subscription } from './subscription.types'
import { AdminService } from '../admin/admin.service'
import { AppUrlService } from '../app-url/app-url.service'
import { User } from 'src/modules/user/schema/user.schema'
import { Injectable, NotFoundException } from '@nestjs/common'
import { getSubscriptions } from 'src/modules/subscription/subscription.constants'

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly adminService: AdminService,
    private readonly appUrlService: AppUrlService,
    private readonly configService: ConfigService
  ) {}

  async sync(user: User) {
    const subscription = await this.findActiveSubscription()
    user.subscription = subscription.name
    user.save()
  }

  getSubscriptionByName(name: string) {
    const subscription = getSubscriptions().find(item => name === item.name)
    if (!subscription) throw new NotFoundException(`Subscription with name ${name} does not exist.`)
    return { ...subscription }
  }

  async findAll(): Promise<Subscription[]> {
    const activeSubscription = await this.findActiveSubscription()
    const subscriptions: Subscription[] = getSubscriptions().filter(
      subscription => subscription.active && subscription.name !== activeSubscription.name
    )
    subscriptions.push(activeSubscription)
    subscriptions.sort((a, b) => a.price - b.price)
    return subscriptions
  }

  // test for price === 0
  async create(user: User, subscriptionName: string) {
    const subscription = this.getSubscriptionByName(subscriptionName)
    const isTestMode = this.configService.get('APP_ENV') !== 'production'
    const redirectUrl = `${await this.appUrlService.find()}/actions/sync`
    const trialDays = subscription.trialDays > user.timeSubscribed ? subscription.trialDays - user.timeSubscribed : 0
    const { data } = await this.adminService.createRequest({
      query: /* GraphQL */ `
        mutation {
          appSubscriptionCreate(
            name: "${subscription.name}",
            test: ${isTestMode},
            returnUrl: "${redirectUrl}",
            trialDays: ${trialDays},
            lineItems: [
              {
                plan: {
                  appRecurringPricingDetails: {
                    price: {
                      amount: ${subscription.price},
                      currencyCode: USD
                    },
                    interval: ${subscription.interval}
                  }
                }
              }
            ]
          ) {
            confirmationUrl
          }
        }
      `
    })
    return data.appSubscriptionCreate.confirmationUrl
  }

  async findActiveSubscription(): Promise<Subscription> {
    const { data } = await this.adminService.createRequest({
      query: /* GraphQL */ `
        {
          appInstallation {
            activeSubscriptions {
              id
              name
            }
          }
        }
      `
    })
    const { name, id } = data.appInstallation.activeSubscriptions[0]
    const subscription = this.getSubscriptionByName(name)
    subscription.id = id
    subscription.subscribed = true
    return subscription
  }

  async cancel() {
    const subscription = await this.findActiveSubscription()
    await this.adminService.createRequest({
      query: /* GraphQL */ `
        mutation {
          appSubscriptionCancel(id: "${subscription.id}") {
            appSubscription {
              id
            }
          }
        }
      `
    })
  }
}
