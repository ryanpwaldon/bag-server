import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { getPlans } from '../../subscription/types/plan.types'
import { Role } from '../../../common/constants/role.constants'
import Cryptr from 'cryptr'
import moment from 'moment'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class User extends Document {
  declare roles: Role[]

  declare _previousPlan: string

  @Prop({ unique: true })
  shopOrigin!: string

  @Prop({ default: false })
  onboarded!: boolean

  @Prop()
  uninstalled!: boolean

  @Prop()
  planUpdatedAt!: Date

  @Prop({
    get(value: string) {
      return value && new Cryptr(process.env.CRYPTO_SECRET as string).decrypt(value)
    },
    set(value: string) {
      return value && new Cryptr(process.env.CRYPTO_SECRET as string).encrypt(value)
    }
  })
  accessToken!: string

  @Prop({
    set(this: User, plan: string) {
      this._previousPlan = this.plan
      return plan
    }
  })
  plan!: string

  @Prop({
    default: 0,
    get(value: number) {
      const duration = this.plan ? value + moment().diff(this.planUpdatedAt) : value
      return Math.round(moment.duration(duration).asDays())
    }
  })
  totalTimeSubscribed!: number

  @Prop()
  super!: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('roles').get(function(this: User) {
  const roles: string[] = []
  const plans = getPlans()
    .filter(plan => plan.active)
    .map(plan => plan.slug)
  roles.push(Role.Installed)
  if (!this.onboarded) roles.push(Role.Unsubscribed)
  else roles.push(...plans.slice(0, plans.indexOf(this.plan as Role) + 1))
  if (this.super) roles.push(...plans)
  return [...new Set(roles)]
})

export async function beforeSave(this: User) {
  if (this.isModified('plan')) {
    if (this._previousPlan) {
      const previousTotalTimeSubscribed = this.get('totalTimeSubscribed', undefined, { getters: false })
      const additionalTimeSubscribed = moment().diff(this.planUpdatedAt)
      this.totalTimeSubscribed = previousTotalTimeSubscribed + additionalTimeSubscribed
    }
    this.planUpdatedAt = new Date()
  }
}
