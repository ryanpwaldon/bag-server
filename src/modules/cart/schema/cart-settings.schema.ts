import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
export class CartSettings extends Document {
  @Prop({ default: '#000000' })
  backdropColor!: string

  @Prop({ default: 0.5 })
  backdropOpacity!: number

  @Prop({ default: '#E5E5E5' })
  borderColor1!: string

  @Prop({ default: 0.1 })
  brightness1!: number

  @Prop({ default: 0 })
  cartPadding!: number

  @Prop({ default: '#171717' })
  checkoutButtonColor!: string

  @Prop({ default: '#ffffff' })
  checkoutButtonTextColor!: string

  @Prop({ default: '#171717' })
  progressBarColor!: string

  @Prop({ default: true })
  roundCorners!: boolean

  @Prop({ default: false })
  showBorders!: boolean

  @Prop({ default: true })
  showShadows!: boolean

  @Prop({ default: '#171717' })
  textColor1!: string

  @Prop({ default: '#737373' })
  textColor2!: string

  @Prop({ default: '#2563EB' })
  textColor3!: string

  @Prop({ default: '#F5F5F5' })
  themeColor1!: string

  @Prop({ default: '#ffffff' })
  themeColor2!: string

  @Prop({ default: false })
  termsEnabled!: boolean

  @Prop({ default: 'Terms & Conditions' })
  termsTitle!: string

  @Prop({ default: 'I agree to the terms and conditions.' })
  termsAgreement!: string

  @Prop({ default: 'View full terms.' })
  termsLinkText!: string

  @Prop({ default: '' })
  termsLinkUrl!: string

  @Prop({ default: false })
  autoCloseEnabled!: boolean

  @Prop({ default: 3 })
  autoCloseDelay!: number
}

export const CartSettingSchema = SchemaFactory.createForClass(CartSettings)
