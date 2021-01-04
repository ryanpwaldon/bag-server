import { cloneDeep } from 'lodash'
import { Interval } from './subscription.types'
import { Subscription } from 'src/modules/subscription/subscription.types'

export const PAID_SUBSCRIPTION_CREATED_PATH = 'paid-subscription-created'

const SUBSCRIPTIONS: Subscription[] = [
  {
    name: 'Starter (1)',
    price: 0,
    trialDays: 0,
    interval: Interval.Monthly,
    title: 'Starter',
    description: 'For merchants looking to improve their checkout experience.',
    featuresIncluded: ['Cart'],
    featuresExcluded: ['Sales growth features'],
    ctaTheme: 'lightBlue',
    legacy: false
  },
  {
    name: 'Growth (1)',
    price: 98,
    trialDays: 30,
    interval: Interval.Monthly,
    title: 'Growth',
    description: 'For merchants looking to grow their sales.',
    featuresIncluded: ['Cart', 'Sales growth features'],
    featuresExcluded: [],
    ctaTheme: 'blue',
    legacy: false
  }
]

export const getSubscriptions = () => cloneDeep(SUBSCRIPTIONS)
