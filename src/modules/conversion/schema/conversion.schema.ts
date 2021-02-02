import { Order } from 'src/common/types/order'
import { User } from '../../user/schema/user.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
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
  type!: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    refPath: 'type',
    required: true
  })
  object!: Types.ObjectId

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  order!: Order

  @Prop()
  value!: number
}

export const ConversionSchema = SchemaFactory.createForClass(Conversion)
