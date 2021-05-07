import moment from 'moment'
import Cryptr from 'cryptr'
import { Permission } from 'src/modules/user/user.types'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Notification } from 'src/modules/notification/notification.constants'
import { getSubscriptions } from 'src/modules/subscription/subscription.constants'

export interface MonthlySalesRecord {
  aov: number
  netSales: number
  orderCount: number
  startTime: Date
  endTime: Date
}

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class User extends Document {
  @Prop({ unique: true })
  shopOrigin!: string

  @Prop()
  uninstalled!: boolean

  @Prop()
  email!: string

  @Prop()
  appUrl!: string

  @Prop({ default: 'USD' })
  currencyCode!: string

  @Prop()
  storeName!: string

  @Prop()
  shopifyPlan!: string

  @Prop()
  shopifyPlus!: boolean

  @Prop()
  primaryDomain!: string

  @Prop()
  developmentStore!: boolean

  @Prop({ default: 'America/New_York' })
  timezone!: string

  @Prop({
    type: [String],
    default: [Notification.Conversion, Notification.ConversionReportWeekly]
  })
  unsubscribedNotifications?: Notification[]

  @Prop([String])
  prevSubscriptions!: string[]

  @Prop({ default: false })
  seenReviewPrompt!: boolean

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

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  monthlySalesRecords!: Record<string, MonthlySalesRecord>

  createdAt!: Date

  daysOld!: number

  @Prop({ default: 0 })
  appOpens!: number
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('daysOld').get(function(this: User) {
  const now = moment()
  const createdAt = moment(this.createdAt)
  return now.diff(createdAt, 'days')
})

UserSchema.virtual('permissions').get(function(this: User) {
  const subscriptions = getSubscriptions()
  const permissions = subscriptions.find(subscription => subscription.name === this.subscription)?.permissions || []
  return permissions
})
