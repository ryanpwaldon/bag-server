import { IsBoolean, IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator'
import { OfferType } from '../offer.types'

const typeIs = (types: OfferType[]) => ({ type }: CreateOfferDto) => types.includes(type)

export class CreateOfferDto {
  @IsNotEmpty()
  @IsEnum(OfferType)
  type!: OfferType

  @ValidateIf(typeIs([OfferType.MinimumSpend]))
  @IsNotEmpty()
  @IsString()
  adminDiscountId!: string

  @ValidateIf(typeIs([OfferType.ProductAddOn]))
  @IsNotEmpty()
  @IsString()
  title!: string

  @ValidateIf(typeIs([OfferType.ProductAddOn]))
  @IsNotEmpty()
  @IsString()
  subtitle!: string

  @ValidateIf(typeIs([OfferType.ProductAddOn]))
  @IsNotEmpty()
  @IsString()
  productId!: string

  @ValidateIf(typeIs([OfferType.ProductAddOn]))
  @IsNotEmpty()
  @IsString({ each: true })
  triggers!: string[]

  @IsNotEmpty()
  @IsBoolean()
  active!: boolean
}
