import { User } from '../../user/schema/user.schema'
import { Order } from 'src/modules/order/schema/order.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { ProgressBar } from 'src/modules/progress-bar/schema/progress-bar.schema'

export type PopulatedConversion = Conversion & { user: User; object: CrossSell | ProgressBar; order: Order }

export enum ConversionType {
  CrossSell = 'CrossSell',
  ProgressBar = 'ProgressBar'
}

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Conversion extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
    autopopulate: true
  })
  user!: Types.ObjectId | User

  @Prop({ required: true, enum: Object.values(ConversionType) })
  type!: ConversionType

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    refPath: 'type',
    required: true,
    autopopulate: true
  })
  object!: Types.ObjectId | CrossSell | ProgressBar

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Order.name,
    required: true,
    autopopulate: true
  })
  order!: Types.ObjectId | Order

  @Prop()
  value?: number
}

export const ConversionSchema = SchemaFactory.createForClass(Conversion)
