import { Role } from '../../common/constants/role.constants'

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
    features: ['Confetti widget', 'Display 2 discounts'],
    active: true,
    subscribed: false,
    id: null
  },
  {
    name: 'Premium (1.0)',
    title: 'Premium',
    slug: Role.Premium,
    price: 30,
    trialDays: 7,
    interval: 'monthly',
    features: ['Confetti widget', 'Display unlimited discounts'],
    active: false,
    subscribed: false,
    id: null
  },
  {
    name: 'Premium (1.1)',
    title: 'Premium',
    slug: Role.Premium,
    price: 19,
    trialDays: 7,
    interval: 'monthly',
    features: ['Confetti widget', 'Display unlimited discounts'],
    active: true,
    subscribed: false,
    id: null
  }
]
