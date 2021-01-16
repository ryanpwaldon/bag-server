import { cloneDeep } from 'lodash'
import { Interval } from './subscription.types'
import { Permission } from 'src/modules/user/user.types'
import { Subscription } from 'src/modules/subscription/subscription.types'

export const PAID_SUBSCRIPTION_CREATED_PATH = 'paid-subscription-created'

const SUBSCRIPTIONS: Subscription[] = [
  {
    name: 'Starter (v1)',
    price: 0,
    trialDays: 0,
    interval: Interval.Monthly,
    title: 'Starter',
    description: 'For merchants looking to improve their checkout experience.',
    featuresIncluded: ['Cart'],
    featuresExcluded: ['Sales growth features'],
    emphasize: false,
    legacy: false,
    permissions: [Permission.CrossSell]
  },
  {
    name: 'Growth (v1)',
    price: 98,
    trialDays: 30,
    interval: Interval.Monthly,
    title: 'Growth',
    description: 'For merchants looking to grow their sales and improve their checkout experience.',
    featuresIncluded: ['Cart', 'Sales growth features'],
    featuresExcluded: [],
    emphasize: true,
    legacy: false,
    permissions: [Permission.CrossSell]
  }
]

export const getSubscriptions = () => cloneDeep(SUBSCRIPTIONS)
