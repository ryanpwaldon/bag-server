import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Cart extends Document {
  @Prop({ required: true })
  user!: MongooseSchema.Types.ObjectId

  @Prop({ default: false })
  active!: boolean
}

export const CartSchema = SchemaFactory.createForClass(Cart)
