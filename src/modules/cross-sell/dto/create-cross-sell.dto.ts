import { TriggerGroup } from 'src/common/types/trigger-group'
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

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

  @IsOptional()
  @ValidateNested()
  triggerGroup?: TriggerGroup
}
