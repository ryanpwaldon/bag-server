import { IsOptional, IsString } from 'class-validator'

export class UpdateCrossSellDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  subtitle?: string

  @IsOptional()
  @IsString()
  productId?: string

  @IsOptional()
  @IsString({ each: true })
  triggerProductIds?: string[]
}
