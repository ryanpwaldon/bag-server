import { cloneDeep } from 'lodash'
import { Interval } from './subscription.types'
import { Subscription } from 'src/modules/subscription/subscription.types'

const SUBSCRIPTIONS: Subscription[] = [
  {
    name: 'Starter (1.0)',
    title: 'Starter',
    price: 0,
    trialDays: 0,
    interval: Interval.Monthly,
    features: ['Cart integration'],
    active: true,
    subscribed: false,
    id: null
  },
  {
    name: 'Premium (1.0)',
    title: 'Premium',
    price: 29,
    trialDays: 7,
    interval: Interval.Monthly,
    features: ['Cart integration', 'Upsell module'],
    active: true,
    subscribed: false,
    id: null
  }
]

export const getSubscriptions = () => cloneDeep(SUBSCRIPTIONS)
