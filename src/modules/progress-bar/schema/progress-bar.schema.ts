import { User } from '../../user/schema/user.schema'
import { TriggerGroup } from 'src/common/types/trigger-group'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { DateRange } from 'src/modules/progress-bar/progress-bar.types'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class ProgressBar extends Document {
  @Prop({ default: 'progressBar' })
  type!: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true
  })
  user!: Types.ObjectId

  @Prop({ default: true })
  active!: boolean

  @Prop({
    default: () => ({ start: new Date() }),
    type: [Object],
    get(this: ProgressBar, activeHistory: DateRange[]) {
      if (this.active) activeHistory[activeHistory.length - 1].end = new Date()
      return activeHistory
    }
  })
  activeHistory!: DateRange[]

  @Prop({ required: true })
  title!: string

  @Prop()
  completionMessage!: string

  @Prop({ required: true })
  goal!: number

  @Prop({ required: true })
  image!: string

  @Prop()
  triggerGroup?: TriggerGroup
}

export const ProgressBarSchema = SchemaFactory.createForClass(ProgressBar)

export async function updateActivePeriods(this: ProgressBar) {
  if (this.isModified('active')) {
    if (this.active) this.activeHistory.push({ start: new Date() })
    else this.activeHistory[this.activeHistory.length - 1].end = new Date()
    this.markModified('activeHistory')
  }
}
