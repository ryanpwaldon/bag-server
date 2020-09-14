import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Plans } from '../../subscription/subscription.constants'
import { Role } from '../../../common/constants/role.constants'
import Cryptr from 'cryptr'
import moment from 'moment'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class User extends Document {
  declare roles

  @Prop({ unique: true })
  shopOrigin: string

  @Prop({ default: false })
  onboarded: boolean

  @Prop()
  uninstalled: boolean

  @Prop()
  planUpdatedAt: Date

  @Prop({
    get(value) {
      return value && new Cryptr(process.env.CRYPTO_SECRET).decrypt(value)
    },
    set(value) {
      return value && new Cryptr(process.env.CRYPTO_SECRET).encrypt(value)
    }
  })
  accessToken: string

  @Prop({
    set(plan) {
      this._previousPlan = this.plan
      return plan
    }
  })
  plan: string

  @Prop({
    default: 0,
    get(value) {
      const duration = this.plan ? value + moment().diff(this.planUpdatedAt) : value
      return Math.round(moment.duration(duration).asDays())
    }
  })
  totalTimeSubscribed: number

  @Prop()
  super: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('roles').get(function() {
  const roles: string[] = []
  const plans = Plans.filter(plan => plan.active).map(plan => plan.slug)
  roles.push(Role.Installed)
  if (!this.onboarded) roles.push(Role.Unsubscribed)
  else roles.push(...plans.slice(0, plans.indexOf(this.plan) + 1))
  if (this.super) roles.push(...plans)
  return [...new Set(roles)]
})

export async function beforeSave() {
  if (this.isModified('plan')) {
    if (this._previousPlan) {
      const previousTotalTimeSubscribed = this.get('totalTimeSubscribed', undefined, { getters: false })
      const additionalTimeSubscribed = moment().diff(this.planUpdatedAt)
      this.totalTimeSubscribed = previousTotalTimeSubscribed + additionalTimeSubscribed
    }
    this.planUpdatedAt = new Date()
  }
}
