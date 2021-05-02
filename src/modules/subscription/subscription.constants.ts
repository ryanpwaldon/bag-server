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
    legacy: true
  },
  {
    type: 'tiered',
    name: 'Small Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 8,
    trialDays: 30,
    title: 'Small store',
    salesTierLowerThreshold: 0,
    salesTierUpperThreshold: 5000,
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
    description: 'For stores processing<br />$0K – $5K sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Medium Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 28,
    trialDays: 30,
    title: 'Medium store',
    salesTierLowerThreshold: 5000,
    salesTierUpperThreshold: 50000,
    description: 'For stores processing<br />$5K – $50K sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Medium Store Yearly (v1)',
    interval: Interval.Annually,
    price: 280,
    trialDays: 30,
    title: 'Medium store',
    salesTierLowerThreshold: 5000,
    salesTierUpperThreshold: 50000,
    description: 'For stores processing<br />$5K – $50K sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Large Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 88,
    trialDays: 30,
    title: 'Large store',
    salesTierLowerThreshold: 50000,
    salesTierUpperThreshold: 500000,
    description: 'For stores processing<br />$50K – $500K sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Large Store Yearly (v1)',
    interval: Interval.Annually,
    price: 880,
    trialDays: 30,
    title: 'Large store',
    salesTierLowerThreshold: 50000,
    salesTierUpperThreshold: 500000,
    description: 'For stores processing<br />$50K – $500K sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Extra large Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 268,
    trialDays: 30,
    title: 'Large store',
    salesTierLowerThreshold: 50000,
    salesTierUpperThreshold: 500000,
    description: 'For stores processing<br />$500K+ sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Extra large Store Yearly (v1)',
    interval: Interval.Annually,
    price: 2680,
    trialDays: 30,
    title: 'Large store',
    salesTierLowerThreshold: 50000,
    salesTierUpperThreshold: 500000,
    description: 'For stores processing<br />$500K+ sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  }
]

export const getSubscriptions = () => cloneDeep(SUBSCRIPTIONS)
