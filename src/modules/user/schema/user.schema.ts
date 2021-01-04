import Cryptr from 'cryptr'
import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ toJSON: { getters: true }, toObject: { getters: true }, timestamps: true })
export class User extends Document {
  @Prop({ unique: true })
  shopOrigin!: string

  @Prop()
  uninstalled!: boolean

  @Prop()
  subscription?: string

  @Prop([String])
  trialedSubscriptions!: string[]

  @Prop({
    get: (value: string) => value && new Cryptr(process.env.CRYPTO_SECRET as string).decrypt(value),
    set: (value: string) => value && new Cryptr(process.env.CRYPTO_SECRET as string).encrypt(value)
  })
  accessToken!: string
}

export const UserSchema = SchemaFactory.createForClass(User)
