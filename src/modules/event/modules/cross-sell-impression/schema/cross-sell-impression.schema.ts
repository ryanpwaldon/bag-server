import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'

@Schema()
export class CrossSellImpression extends Document {
  @Prop({ required: true })
  cartToken!: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: CrossSell.name,
    required: true,
    autopopulate: true
  })
  crossSell!: CrossSell
}

export const CrossSellImpressionSchema = SchemaFactory.createForClass(CrossSellImpression)
