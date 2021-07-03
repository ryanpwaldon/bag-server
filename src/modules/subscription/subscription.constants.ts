import { cloneDeep } from 'lodash'
import { Permission } from 'src/modules/user/user.types'
import { SpecialSubscription, Interval, TieredSubscription } from './subscription.types'

export const PAID_SUBSCRIPTION_CREATED_PATH = 'paid-subscription-created'

const SUBSCRIPTIONS: Array<SpecialSubscription | TieredSubscription> = [
  {
    type: 'special',
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
    type: 'special',
    name: 'Free (v1)',
    interval: Interval.Monthly,
    price: 0,
    trialDays: 0,
    title: 'Free',
    description: 'For merchants looking to grow their sales and improve their checkout experience.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Small Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 8,
    trialDays: 0,
    title: 'Small store',
    salesTierLowerThreshold: 0,
    salesTierUpperThreshold: 5000,
    description: 'For stores processing<br />$0K – $5K USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Small Store Yearly (v1)',
    interval: Interval.Annually,
    price: 80,
    trialDays: 0,
    title: 'Small store',
    salesTierLowerThreshold: 0,
    salesTierUpperThreshold: 5000,
    description: 'For stores processing<br />$0K – $5K USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Medium Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 28,
    trialDays: 0,
    title: 'Medium store',
    salesTierLowerThreshold: 5000,
    salesTierUpperThreshold: 25000,
    description: 'For stores processing<br />$5K – $25K USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Medium Store Yearly (v1)',
    interval: Interval.Annually,
    price: 280,
    trialDays: 0,
    title: 'Medium store',
    salesTierLowerThreshold: 5000,
    salesTierUpperThreshold: 25000,
    description: 'For stores processing<br />$5K – $25K USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Large Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 88,
    trialDays: 0,
    title: 'Large store',
    salesTierLowerThreshold: 25000,
    salesTierUpperThreshold: 100000,
    description: 'For stores processing<br />$25K – $100K USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'Large Store Yearly (v1)',
    interval: Interval.Annually,
    price: 880,
    trialDays: 0,
    title: 'Large store',
    salesTierLowerThreshold: 25000,
    salesTierUpperThreshold: 100000,
    description: 'For stores processing<br />$25K – $100K USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'XL Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 268,
    trialDays: 0,
    title: 'Extra large store',
    salesTierLowerThreshold: 100000,
    salesTierUpperThreshold: 500000,
    description: 'For stores processing<br />$100K – $500K USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'XL Store Yearly (v1)',
    interval: Interval.Annually,
    price: 2680,
    trialDays: 0,
    title: 'Extra large store',
    salesTierLowerThreshold: 100000,
    salesTierUpperThreshold: 500000,
    description: 'For stores processing<br />$100K – $500K USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'XXL Store Monthly (v1)',
    interval: Interval.Monthly,
    price: 788,
    trialDays: 0,
    title: 'XXL store',
    salesTierLowerThreshold: 500000,
    salesTierUpperThreshold: Infinity,
    description: 'For stores processing<br />$500K+ USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  },
  {
    type: 'tiered',
    name: 'XXL Store Yearly (v1)',
    interval: Interval.Annually,
    price: 7880,
    trialDays: 0,
    title: 'XXL store',
    salesTierLowerThreshold: 500000,
    salesTierUpperThreshold: Infinity,
    description: 'For stores processing<br />$500K+ USD sales per month.',
    permissions: [Permission.CrossSell, Permission.ProgressBar],
    legacy: false
  }
]

export const getSubscriptions = () => cloneDeep(SUBSCRIPTIONS)
