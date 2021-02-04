import Cryptr from 'cryptr'
import { Document } from 'mongoose'
import { Permission } from 'src/modules/user/user.types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Notification } from 'src/modules/notification/notification.constants'
import { getSubscriptions } from 'src/modules/subscription/subscription.constants'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class User extends Document {
  @Prop({ unique: true })
  shopOrigin!: string

  @Prop()
  uninstalled!: boolean

  @Prop()
  email!: string

  @Prop()
  currencyCode!: string

  @Prop([String])
  unsubscribedNotifications?: Notification[]

  @Prop([String])
  prevSubscriptions!: string[]

  @Prop({
    set(this: User, subscription: string) {
      if (subscription) this.prevSubscriptions = [...new Set([...this.prevSubscriptions, subscription])]
      return subscription
    }
  })
  subscription?: string

  @Prop({
    get: (value: string) => value && new Cryptr(process.env.CRYPTO_SECRET as string).decrypt(value),
    set: (value: string) => value && new Cryptr(process.env.CRYPTO_SECRET as string).encrypt(value)
  })
  accessToken!: string

  permissions!: Permission[]
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('permissions').get(function(this: User) {
  const subscriptions = getSubscriptions()
  const permissions = subscriptions.find(subscription => subscription.name === this.subscription)?.permissions || []
  return permissions
})
