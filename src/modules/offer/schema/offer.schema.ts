import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../user/schema/user.schema'
import { OfferType } from '../offer.types'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Offer extends Document {
  @Prop({ required: true, ref: User.name })
  user!: MongooseSchema.Types.ObjectId

  @Prop({ enum: Object.values(OfferType) })
  type!: OfferType

  @Prop({ default: false })
  active!: boolean

  @Prop()
  activeFor!: number

  @Prop()
  adminDiscountId!: string

  @Prop()
  title!: string

  @Prop()
  subtitle!: string

  @Prop([String])
  triggers!: string[]

  @Prop()
  productId!: string
}

export const OfferSchema = SchemaFactory.createForClass(Offer)
