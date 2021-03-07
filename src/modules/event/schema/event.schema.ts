import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

enum EventType {
  CrossSellImpression = 'CrossSellImpression'
}

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true, discriminatorKey: 'type' })
export class Event extends Document {
  @Prop({ required: true, enum: Object.values(EventType) })
  type!: EventType
}

export const EventSchema = SchemaFactory.createForClass(Event)
