import { User } from '../../user/schema/user.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { CartSettings, CartSettingSchema } from 'src/modules/cart/schema/cart-settings.schema'

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

  @Prop({ type: CartSettingSchema, default: () => ({}) })
  cartSettings!: CartSettings
}

export const CartSchema = SchemaFactory.createForClass(Cart)
