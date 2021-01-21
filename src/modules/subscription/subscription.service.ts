import { ConfigService } from '@nestjs/config'
import { AdminService } from '../admin/admin.service'
import { ActiveSubscription } from './subscription.types'
import { User } from 'src/modules/user/schema/user.schema'
import { BadRequestException, Injectable } from '@nestjs/common'
import { getSubscriptions, PAID_SUBSCRIPTION_CREATED_PATH } from 'src/modules/subscription/subscription.constants'

@Injectable()
export class SubscriptionService {
  constructor(private readonly adminService: AdminService, private readonly configService: ConfigService) {}

  findAll() {
    return getSubscriptions()
  }

  findByName(name?: string) {
    return getSubscriptions().find(item => item.name === name)
  }

  async findActiveSubscription(): Promise<ActiveSubscription | null> {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
        {
          appInstallation {
            activeSubscriptions {
              id
              name
              createdAt
              trialDays
              currentPeriodEnd
            }
          }
        }
      `
    })
    const subscription = data.appInstallation.activeSubscriptions[0]
    if (!subscription) return null
    return subscription
  }

  async createFreeSubscription(user: User, name: string) {
    const subscription = this.findByName(name)
    if (!subscription || subscription.price !== 0) throw new BadRequestException()
    user.subscription = subscription.name
    return user.save()
  }

  async createPaidSubscription(user: User, subscriptionName: string) {
    const subscription = this.findByName(subscriptionName)
    if (!subscription) throw new BadRequestException()
    const isTestMode = this.configService.get('APP_ENV') !== 'production'
    // prettier-ignore
    const redirectUrl = `${this.configService.get('SERVER_URL')}/subscription/${PAID_SUBSCRIPTION_CREATED_PATH}?shopOrigin=${user.shopOrigin}`
    const trialDays = user.prevSubscriptions.includes(subscription.name) ? 0 : subscription.trialDays
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
        mutation {
          appSubscriptionCreate(
            test: ${isTestMode},
            trialDays: ${trialDays},
            returnUrl: "${redirectUrl}",
            name: "${subscription.name}",
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

  async cancel(user: User) {
    const activeSubscription = await this.findActiveSubscription()
    if (activeSubscription) {
      await this.adminService.createGraphQLRequest({
        query: /* GraphQL */ `
          mutation {
            appSubscriptionCancel(id: "${activeSubscription.id}") {
              appSubscription {
                id
              }
            }
          }
        `
      })
    }
    user.subscription = undefined
    return user.save()
  }

  async sync(user: User) {
    const userSubscription = this.findByName(user.subscription)
    const activeSubscription = await this.findActiveSubscription()
    if (activeSubscription) user.subscription = activeSubscription.name
    else if (userSubscription && userSubscription.price === 0) return user
    else user.subscription = undefined
    return user.save()
  }
}
