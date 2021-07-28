import { User } from '../../user/schema/user.schema'
import { CartSettings } from 'src/common/types/cart-settings'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Cart extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true
  })
  user!: Types.ObjectId

  @Prop({ default: false })
  active!: boolean

  @Prop({ default: new CartSettings() })
  cartSettings!: CartSettings
}

export const CartSchema = SchemaFactory.createForClass(Cart)
