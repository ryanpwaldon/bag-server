import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ProgressBar } from 'src/modules/progress-bar/schema/progress-bar.schema'

@Schema()
export class ProgressBarImpression extends Document {
  @Prop({ required: true })
  cartToken!: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ProgressBar.name,
    required: true,
    autopopulate: true
  })
  progressBar!: ProgressBar
}

export const ProgressBarImpressionSchema = SchemaFactory.createForClass(ProgressBarImpression)
