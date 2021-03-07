import { User } from 'src/common/decorators/user.decorator'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'

@Schema()
export class OrderCreated extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true
  })
  user!: Types.ObjectId
}

export const OrderCreatedSchema = SchemaFactory.createForClass(OrderCreated)
