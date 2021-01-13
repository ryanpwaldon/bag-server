import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CrossSellImpression } from 'src/modules/event/modules/cross-sell-impression/schema/cross-sell-impression.schema'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true, discriminatorKey: 'type' })
export class Event extends Document {
  @Prop({ required: true, enum: [CrossSellImpression.name] })
  type!: string
}

export const EventSchema = SchemaFactory.createForClass(Event)
