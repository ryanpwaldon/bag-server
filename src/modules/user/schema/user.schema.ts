import Cryptr from 'cryptr'
import moment from 'moment'
import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class User extends Document {
  _previousPlan!: string

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

  @Prop()
  subscription!: string

  @Prop({
    default: 0,
    get(value: number) {
      const duration = this.plan ? value + moment().diff(this.planUpdatedAt) : value
      return Math.round(moment.duration(duration).asDays())
    }
  })
  timeSubscribed!: number

  @Prop()
  super!: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)

export async function beforeSave(this: User) {
  if (this.isModified('plan')) {
    if (this._previousPlan) {
      const previoustimeSubscribed = this.get('timeSubscribed', undefined, { getters: false })
      const additionalTimeSubscribed = moment().diff(this.planUpdatedAt)
      this.timeSubscribed = previoustimeSubscribed + additionalTimeSubscribed
    }
    this.planUpdatedAt = new Date()
  }
}
