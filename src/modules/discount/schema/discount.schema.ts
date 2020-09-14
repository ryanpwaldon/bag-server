import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../user/schema/user.schema'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Discount extends Document {
  @Prop({ required: true, ref: User.name })
  user: MongooseSchema.Types.ObjectId

  @Prop()
  shopifyId: string

  @Prop({ default: false })
  active: boolean
}

export const DiscountSchema = SchemaFactory.createForClass(Discount)
