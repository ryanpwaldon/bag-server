import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Offer } from '../../offer/schema/offer.schema'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Order extends Document {
  @Prop({ required: true, ref: Offer.name })
  offer: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  orderId: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
