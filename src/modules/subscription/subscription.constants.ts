import { cloneDeep } from 'lodash'
import { Interval } from './subscription.types'
import { Permission } from 'src/modules/user/user.types'
import { Subscription } from 'src/modules/subscription/subscription.types'

export const PAID_SUBSCRIPTION_CREATED_PATH = 'paid-subscription-created'

const SUBSCRIPTIONS: Subscription[] = [
  {
    name: 'Early Access (v1)',
    price: 0,
    trialDays: 0,
    interval: Interval.Monthly,
    title: 'Early Access',
    description: 'For merchants looking to grow their sales and improve their checkout experience.',
    featuresIncluded: ['Cart', 'Sales growth features'],
    featuresExcluded: [],
    emphasize: true,
    legacy: false,
    permissions: [Permission.CrossSell]
  }
]

export const getSubscriptions = () => cloneDeep(SUBSCRIPTIONS)
