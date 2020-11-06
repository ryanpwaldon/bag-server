import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCrossSellDto {
  @IsNotEmpty()
  @IsString()
  title!: string

  @IsNotEmpty()
  @IsString()
  subtitle!: string

  @IsNotEmpty()
  @IsString()
  productId!: string

  @IsNotEmpty()
  @IsString({ each: true })
  triggerProductIds!: string[]
}
