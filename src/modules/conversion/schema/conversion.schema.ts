import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../user/schema/user.schema'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'

export const CONVERSION_TYPES = [CrossSell.name]

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Conversion extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true
  })
  user!: Types.ObjectId

  @Prop({ required: true, enum: CONVERSION_TYPES })
  offerModel!: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    refPath: 'offerModel',
    required: true
  })
  offer!: Types.ObjectId

  @Prop({ required: true })
  orderId!: string

  @Prop()
  value?: number
}

export const ConversionSchema = SchemaFactory.createForClass(Conversion)
