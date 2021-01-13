import { Permission } from 'src/modules/user/user.types'

export enum Interval {
  Monthly = 'EVERY_30_DAYS',
  Annually = 'ANNUAL'
}

export type ActiveSubscription = {
  id: string
  name: string
  createdAt: Date
  trialDays: number
  currentPeriodEnd: Date
}

export type Subscription = {
  name: string
  price: number
  trialDays: number
  interval: Interval
  title: string
  description: string
  featuresIncluded: string[]
  featuresExcluded: string[]
  emphasize: boolean
  legacy: boolean
  permissions: Permission[]
}
