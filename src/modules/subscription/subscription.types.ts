export enum Interval {
  Monthly = 'EVERY_30_DAYS',
  Annually = 'ANNUAL'
}

export type Subscription = {
  name: string
  title: string
  price: number
  trialDays: number
  interval: Interval
  features: string[]
  active: boolean // is this subscription active or legacy?
  subscribed: boolean // is the user subscribed to this subscription?
  id: string | null
}
