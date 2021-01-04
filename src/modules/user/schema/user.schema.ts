import Cryptr from 'cryptr'
import moment from 'moment'
import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class User extends Document {
  @Prop({ unique: true })
  shopOrigin!: string

  @Prop({ default: false })
  onboarded!: boolean

  @Prop()
  uninstalled!: boolean

  @Prop()
  planUpdatedAt!: Date

  prevSubscription?: string

  @Prop({
    set(this: User, subscription: string) {
      this.prevSubscription = this.subscription
      return subscription
    }
  })
  subscription?: string

  @Prop({
    default: 0,
    get(value: number) {
      const duration = this.subscription ? value + moment().diff(this.planUpdatedAt) : value
      return Math.round(moment.duration(duration).asDays())
    }
  })
  timeSubscribed!: number

  @Prop({
    get: (value: string) => value && new Cryptr(process.env.CRYPTO_SECRET as string).decrypt(value),
    set: (value: string) => value && new Cryptr(process.env.CRYPTO_SECRET as string).encrypt(value)
  })
  accessToken!: string
}

export const UserSchema = SchemaFactory.createForClass(User)

export async function beforeSave(this: User) {
  if (this.isModified('subscription')) {
    if (this.prevSubscription) {
      const previousTimeSubscribed = this.get('timeSubscribed', undefined, { getters: false })
      const additionalTimeSubscribed = moment().diff(this.planUpdatedAt)
      this.timeSubscribed = previousTimeSubscribed + additionalTimeSubscribed
    }
    this.planUpdatedAt = new Date()
  }
}
