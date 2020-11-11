import { Document, SchemaTypes } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

type CrossSellImpression = {
  crossSellId: string
  productId: string
}

type DiscountAchieved = {
  discountId: string
}

type CartEventMeta = CrossSellImpression | DiscountAchieved

export enum CartEventType {
  CrossSellImpression = 'crossSellImpression'
}

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class CartEvent extends Document {
  @Prop({ required: true })
  cartToken!: string

  @Prop({ required: true, enum: Object.values(CartEventType) })
  type!: CartEventType

  @Prop({ type: SchemaTypes.Mixed })
  meta!: CartEventMeta
}

export const CartEventSchema = SchemaFactory.createForClass(CartEvent)
