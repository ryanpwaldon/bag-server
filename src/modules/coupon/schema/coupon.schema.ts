import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Coupon extends Document {
  @Prop({ unique: true })
  code!: string

  @Prop({ default: false })
  redeemed!: boolean
}

export const CouponSchema = SchemaFactory.createForClass(Coupon)
