import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export interface Payout {
  periodEnd: Date
  periodStart: Date
  value: number
}

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true, minimize: false })
export class Affiliate extends Document {
  @Prop({ required: true, unique: true })
  email!: string

  @Prop()
  payPalEmail!: string

  @Prop({ default: 0 })
  linkClicks!: number

  @Prop({ required: false })
  code!: string

  @Prop({
    type: Boolean,
    default: true
  })
  referralNotification?: boolean

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  payouts!: Record<string, Payout>
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate)

AffiliateSchema.virtual('setupComplete').get(function(this: Affiliate) {
  return !!this.payPalEmail
})
