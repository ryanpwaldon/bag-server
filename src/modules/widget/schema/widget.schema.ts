import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../user/schema/user.schema'

enum Position {
  Left = 'left',
  Right = 'right'
}

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class Widget extends Document {
  @Prop({ required: true, ref: User.name })
  user: MongooseSchema.Types.ObjectId

  @Prop({ default: false })
  active: boolean

  @Prop({ default: Position.Right, enum: Object.values(Position) })
  position: Position

  @Prop({ default: 20, min: 20 })
  padding: number
}

export const WidgetSchema = SchemaFactory.createForClass(Widget)
