import {
  Injectable,
  BadRequestException,
  Inject,
  Scope,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AdminService } from '../admin/admin.service'
import { getPlanByName, getPlanBySlug, getPlans, Plan } from './types/plan.types'
import { UserService } from '../user/user.service'
import { REQUEST } from '@nestjs/core'
import { Role } from '../../common/constants/role.constants'
import { AdminMetaService } from '../admin-meta/admin-meta.service'
import { Request } from 'express'
import { User } from 'src/modules/user/schema/user.schema'

@Injectable({ scope: Scope.REQUEST })
export class AdminSubscriptionService {
  constructor(
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly adminMetaService: AdminMetaService,
    @Inject(REQUEST) private req: Request & { user: User }
  ) {}

  async sync() {
    const user = await this.userService.findById(this.req.user.id)
    if (!user) throw new NotFoundException('User not found.')
    const plan = await this.findMyActivePlan()
    user.plan = plan.slug
    user.save()
  }

  async findAllPlans(): Promise<Plan[]> {
    const activePlan = await this.findMyActivePlan()
    const plans: Plan[] = getPlans().filter(plan => plan.active && plan.name !== activePlan.name)
    plans.push(activePlan)
    plans.sort((a, b) => a.price - b.price)
    return plans
  }

  convertToShopifyInterval(interval: 'monthly' | 'annually') {
    if (interval === 'monthly') return 'EVERY_30_DAYS'
    if (interval === 'annually') return 'ANNUAL'
    throw new BadRequestException('Interval is not valid.')
  }

  async create(name: string) {
    const plan = getPlanByName(name)
    if (!plan) throw new NotFoundException('Plan not found.')
    const user = await this.userService.findById(this.req.user.id)
    if (!user) throw new NotFoundException('User not found.')
    user.onboarded = true
    await user.save()
    if (plan.price === 0) return this.cancel()
    const isProduction = this.configService.get('APP_ENV') === 'production'
    const redirectUrl = `${await this.adminMetaService.getAppUrl()}/actions/sync`
    const trialDays = plan.trialDays > user.totalTimeSubscribed ? plan.trialDays - user.totalTimeSubscribed : 0
    const { data } = await this.adminService.createRequest({
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
                    interval: ${this.convertToShopifyInterval(plan.interval as 'monthly' | 'annually')}
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
    const { data } = await this.adminService.createRequest({
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
    if (!subscription) throw new NotFoundException('Subscription not found.')
    const plan = getPlanByName(subscription.name) || getPlanBySlug(Role.Starter)
    if (!plan) throw new InternalServerErrorException()
    plan.id = subscription && subscription.id
    plan.subscribed = this.req.user.onboarded && true
    return plan
  }

  async cancel() {
    const plan = await this.findMyActivePlan()
    if (!plan.id) return
    await this.adminService.createRequest({
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
