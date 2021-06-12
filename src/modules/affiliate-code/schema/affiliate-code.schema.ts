import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { Affiliate } from 'src/modules/affiliate/schema/affiliate.schema'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class AffiliateCode extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Affiliate.name,
    required: true
  })
  affiliate!: Types.ObjectId

  @Prop({ required: true })
  code!: string
}

export const AffiliateCodeSchema = SchemaFactory.createForClass(AffiliateCode)
