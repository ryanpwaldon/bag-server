import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Affiliate extends Document {
  @Prop({ required: true, unique: true })
  email!: string

  @Prop()
  payPalEmail!: string

  @Prop({ default: 0 })
  linkClicks!: number

  @Prop({ required: false })
  code!: string
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate)
