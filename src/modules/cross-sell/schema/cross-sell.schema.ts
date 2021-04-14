import { User } from '../../user/schema/user.schema'
import { TriggerGroup } from 'src/common/types/trigger-group'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class CrossSell extends Document {
  @Prop({ default: 'crossSell' })
  type!: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true
  })
  user!: Types.ObjectId

  @Prop({ default: true })
  active!: boolean

  @Prop()
  activeFor!: number

  @Prop({ required: true })
  productId!: string

  @Prop({ required: true })
  title!: string

  @Prop({ required: true })
  subtitle!: string

  @Prop([String])
  triggerProductIds!: string[]

  @Prop()
  triggerGroup?: TriggerGroup

  product?: any
}

export const CrossSellSchema = SchemaFactory.createForClass(CrossSell)
