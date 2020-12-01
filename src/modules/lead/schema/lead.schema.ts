import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Lead extends Document {
  @Prop({ required: true })
  email!: string

  @Prop({ required: true })
  shopUrl!: string
}

export const LeadSchema = SchemaFactory.createForClass(Lead)
