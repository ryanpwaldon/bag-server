import cloneDeep from 'lodash/cloneDeep'
import { Role } from '../../../common/constants/role.constants'

export type Plan = {
  readonly name: string
  readonly title: string
  readonly slug: Role
  readonly price: number
  readonly trialDays: number
  readonly interval: 'monthly' | 'annually' | null
  readonly features: string[]
  readonly active: boolean // is this plan active or legacy?
  readonly subscribed: boolean // is the user subscribed to this plan?
  readonly id: string | null
}

const Plans: Plan[] = [
  {
    name: 'Starter (1.0)',
    title: 'Starter',
    slug: Role.Starter,
    price: 0,
    trialDays: 0,
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

export const getPlans = () => {
  return cloneDeep(Plans)
}

export const getPlanByName = (name: string) => {
  const plan = Plans.find(item => name === item.name)
  return plan ? { ...plan } : null
}

export const getPlanBySlug = (slug: string) => {
  const plan = Plans.find(item => slug === item.slug)
  return plan ? { ...plan } : null
}
