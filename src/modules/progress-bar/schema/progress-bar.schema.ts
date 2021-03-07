import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../user/schema/user.schema'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class ProgressBar extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true
  })
  user!: Types.ObjectId

  @Prop({ default: true })
  active!: boolean

  @Prop({ required: true })
  title!: string

  @Prop()
  completionMessage!: string

  @Prop({ required: true })
  goal!: number

  @Prop({ required: true })
  image!: string
}

export const ProgressBarSchema = SchemaFactory.createForClass(ProgressBar)
