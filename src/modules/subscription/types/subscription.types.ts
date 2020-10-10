import { Role } from '../../../common/constants/role.constants'

export type Plan = {
  name: string
  title: string
  slug: Role
  price: number
  trialDays: number
  interval: 'monthly' | 'annually'
  features: string[]
  active: boolean // is this plan active or legacy?
  subscribed: boolean // is the user subscribed to this plan?
  id: string // shopify subscription id
}

type Readonly<T> = {
  readonly [K in keyof T]: any
}

export const Plans: Readonly<Plan>[] = [
  {
    name: 'Starter (1.0)',
    title: 'Starter',
    slug: Role.Starter,
    price: 0,
    trialDays: null,
    interval: null,
    features: ['Cart integration'],
    active: true,
    subscribed: false,
    id: null
  },
  {
    name: 'Premium (1.0)',
    title: 'Premium',
    slug: Role.Premium,
    price: 29,
    trialDays: 7,
    interval: 'monthly',
    features: ['Cart integration', 'Upsell module'],
    active: true,
    subscribed: false,
    id: null
  }
]
