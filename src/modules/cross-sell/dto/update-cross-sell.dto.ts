import { TriggerGroup } from 'src/common/types/trigger-group'
import { IsOptional, IsString, ValidateNested } from 'class-validator'

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
  @ValidateNested()
  triggerGroup?: TriggerGroup
}
