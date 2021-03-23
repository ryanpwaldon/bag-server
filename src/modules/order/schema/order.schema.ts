import { User } from '../../user/schema/user.schema'
import { AdminOrder } from 'src/common/types/admin-order'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Order extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true
  })
  user!: Types.ObjectId | User

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  details!: AdminOrder
}

export const OrderSchema = SchemaFactory.createForClass(Order)
