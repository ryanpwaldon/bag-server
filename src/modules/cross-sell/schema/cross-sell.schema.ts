import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../user/schema/user.schema'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class CrossSell extends Document {
  @Prop({ required: true, ref: User.name })
  user!: MongooseSchema.Types.ObjectId

  @Prop({ default: true })
  active!: boolean

  @Prop()
  activeFor!: number

  @Prop()
  productId!: string

  @Prop()
  title!: string

  @Prop()
  subtitle!: string

  @Prop([String])
  triggerProductIds!: string[]
}

export const CrossSellSchema = SchemaFactory.createForClass(CrossSell)
