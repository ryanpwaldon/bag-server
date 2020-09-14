import { Injectable, BadRequestException, Inject, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ShopifyService } from '../shopify/shopify.service'
import { Plans, Plan } from './subscription.constants'
import { UserService } from '../user/user.service'
import { REQUEST } from '@nestjs/core'
import { InstallationService } from '../installation/installation.service'
import cloneDeep from 'lodash/cloneDeep'
import { Logger } from 'nestjs-pino'
import { Role } from '../../common/constants/role.constants'

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionService {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly installationService: InstallationService,
    private readonly logger: Logger,
    @Inject(REQUEST) private req
  ) {}

  async findAllPlans(): Promise<Plan[]> {
    const activePlan = await this.findMyActivePlan()
    const plans: Plan[] = cloneDeep(Plans).filter(plan => plan.active && plan.name !== activePlan.name)
    plans.push(activePlan)
    plans.sort((a, b) => a.price - b.price)
    return plans
  }

  async sync() {
    const user = await this.userService.findById(this.req.user.id)
    const plan = await this.findMyActivePlan()
    user.plan = plan.slug
    user.save()
  }

  convertToShopifyInterval(interval: 'monthly' | 'annually') {
    if (interval === 'monthly') return 'EVERY_30_DAYS'
    if (interval === 'annually') return 'ANNUAL'
    throw new BadRequestException('Interval is not valid.')
  }

  async create(name) {
    const plan = Plans.find(plan => plan.name === name)
    if (!plan) throw new BadRequestException('Plan does not exist.')
    const user = await this.userService.findById(this.req.user.id)
    user.onboarded = true
    await user.save()
    if (plan.price === 0) return this.cancel()
    const isProduction = this.configService.get('APP_ENV') === 'production'
    const redirectUrl = `${await this.installationService.findAppUrl()}/actions/sync`
    const trialDays = plan.trialDays > user.totalTimeSubscribed ? plan.trialDays - user.totalTimeSubscribed : 0
    const { data } = await this.shopifyService.createRequest({
      query: `
        mutation {
          appSubscriptionCreate(
            name: "${plan.name}",
            test: ${!isProduction},
            returnUrl: "${redirectUrl}",
            trialDays: ${trialDays},
            lineItems: [
              {
                plan: {
                  appRecurringPricingDetails: {
                    price: {
                      amount: ${plan.price},
                      currencyCode: USD
                    },
                    interval: ${this.convertToShopifyInterval(plan.interval)}
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

  async findMyActivePlan(): Promise<Plan> {
    const { data } = await this.shopifyService.createRequest({
      query: `
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
    const [subscription] = data.appInstallation.activeSubscriptions
    const plan = {
      ...(subscription
        ? Plans.find(plan => plan.name === subscription.name)
        : Plans.find(plan => plan.slug === Role.Starter))
    }
    plan.id = subscription && subscription.id
    plan.subscribed = this.req.user.onboarded && true
    return plan
  }

  async registerOnUpdateWebhook() {
    const topic = 'APP_SUBSCRIPTIONS_UPDATE'
    const webhooks = (
      await this.shopifyService.createRequest({
        query: `
        {
          webhookSubscriptions (first: 1, topics: ${topic}) {
            edges {
              node {
                id
              }
            }
          }
        }
      `
      })
    ).data.webhookSubscriptions.edges
    if (webhooks.length) return
    const callbackUrl = `${this.configService.get('SERVER_URL')}/subscription/sync`
    this.shopifyService.createRequest({
      query: `
        mutation {
          webhookSubscriptionCreate (topic: ${topic}, webhookSubscription: {
            callbackUrl: "${callbackUrl}",
            format: JSON
          }) {
            webhookSubscription {
              id
            }
          }
        }
      `
    })
    this.logger.log(`Webhook created: ${topic}`)
  }

  async cancel() {
    const plan = await this.findMyActivePlan()
    if (!plan.id) return
    await this.shopifyService.createRequest({
      query: `
        mutation {
          appSubscriptionCancel(id: "${plan.id}") {
            appSubscription {
              id
            }
          }
        }
      `
    })
    await this.sync()
  }
}
