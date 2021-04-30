import { cloneDeep } from 'lodash'
import { Permission } from 'src/modules/user/user.types'
import { EarlyAccessSubscription, Interval, TieredSubscription } from './subscription.types'

export const PAID_SUBSCRIPTION_CREATED_PATH = 'paid-subscription-created'

const SUBSCRIPTIONS: Array<EarlyAccessSubscription | TieredSubscription> = [
  {
    type: 'earlyAccess',
    name: 'Early Access (v1)',
    interval: Interval.Monthly,
    price: 0,
    trialDays: 0,
    title: 'Early Access',
    description: 'For merchants looking to grow their sales and improve their checkout experience.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Small Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 8,
    salesTierLowerThreshold: 0,
    salesTierUpperThreshold: 5000,
    trialDays: 30,
    title: 'Small store',
    description: 'For stores processing<br />$0K – $5K sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Small Store Yearly (v1)',
    interval: Interval.Annually,
    price: 80,
    trialDays: 30,
    title: 'Small store',
    salesTierLowerThreshold: 0,
    salesTierUpperThreshold: 5000,
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    description: 'For stores processing<br />$0K – $5K sales per month.',
    legacy: false
  }
]

export const getSubscriptions = () => cloneDeep(SUBSCRIPTIONS)
