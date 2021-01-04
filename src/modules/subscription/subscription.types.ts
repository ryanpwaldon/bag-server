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
  ctaText: string
  ctaTheme: string
  legacy: boolean
}
