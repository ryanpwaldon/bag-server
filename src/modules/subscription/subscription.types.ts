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

type Subscription = {
  name: string
  type: string
  price: number
  title: string
  legacy: boolean
  trialDays: number
  interval: Interval
  description: string
  permissions: Permission[]
}

export type EarlyAccessSubscription = Subscription & {
  type: 'earlyAccess'
}

export type TieredSubscription = Subscription & {
  type: 'tiered'
  salesTierLowerThreshold: number
  salesTierUpperThreshold: number
}
