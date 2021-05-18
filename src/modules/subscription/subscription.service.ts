import { ConfigService } from '@nestjs/config'
import { AdminService } from '../admin/admin.service'
import { User } from 'src/modules/user/schema/user.schema'
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ActiveSubscription, Interval, TieredSubscription } from './subscription.types'
import { getSubscriptions, PAID_SUBSCRIPTION_CREATED_PATH } from 'src/modules/subscription/subscription.constants'

const getRecentNetSales = (user: User) => {
  const monthlySalesRecords = Object.values(user.monthlySalesRecords)
  const [recentMonthlySalesRecord] = monthlySalesRecords.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
  return recentMonthlySalesRecord.netSales
}

@Injectable()
export class SubscriptionService {
  constructor(private readonly adminService: AdminService, private readonly configService: ConfigService) {}

  findAllTiered() {
    return getSubscriptions().filter(item => item.type === 'tiered' && !item.legacy)
  }

  async findSuitableSubscriptionPair(user: User) {
    const recentNetSales = getRecentNetSales(user)
    const tieredSubscriptions = getSubscriptions().filter(({ type, legacy }) => {
      return type === 'tiered' && !legacy
    }) as TieredSubscription[]
    const matchedSubscriptions = tieredSubscriptions.filter(({ salesTierLowerThreshold, salesTierUpperThreshold }) => {
      return recentNetSales >= salesTierLowerThreshold && recentNetSales < salesTierUpperThreshold
    })
    if (matchedSubscriptions.length !== 2) throw new InternalServerErrorException('Matched subscriptions exceeds 2.')
    const monthlySubscription = matchedSubscriptions.find(({ interval }) => interval === Interval.Monthly)
    const yearlySubscription = matchedSubscriptions.find(({ interval }) => interval === Interval.Annually)
    return [monthlySubscription, yearlySubscription]
  }

  findByName(name?: string) {
    return getSubscriptions().find(item => item.name === name)
  }

  async findActiveSubscription(user: User): Promise<ActiveSubscription | null> {
    const { data } = await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        {
          appInstallation {
            activeSubscriptions {
              id
              name
              createdAt
              trialDays
              currentPeriodEnd
              lineItems {
                plan {
                  pricingDetails {
                    ... on AppRecurringPricing {
                      interval
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
    const [subscription] = data.appInstallation.activeSubscriptions
    if (!subscription) return null
    return {
      id: subscription.id,
      name: subscription.name,
      createdAt: subscription.createdAt,
      trialDays: subscription.trialDays,
      currentPeriodEnd: subscription.currentPeriodEnd,
      title: this.findByName(subscription.name)?.title,
      price: subscription.lineItems[0].plan.pricingDetails.price.amount,
      interval: subscription.lineItems[0].plan.pricingDetails.interval
    }
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
    const { data } = await this.adminService.createGraphQLRequest(user, {
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
    const activeSubscription = await this.findActiveSubscription(user)
    if (activeSubscription) {
      await this.adminService.createGraphQLRequest(user, {
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
    const activeSubscription = await this.findActiveSubscription(user)
    if (activeSubscription) user.subscription = activeSubscription.name
    else if (userSubscription && userSubscription.price === 0) return user
    else user.subscription = undefined
    return user.save()
  }
}
