import { TriggerGroup } from 'src/common/types/trigger-group'
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class UpdateProgressBarDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  completionMessage?: string

  @IsOptional()
  @IsNumber()
  goal?: number

  @IsOptional()
  @IsString()
  image?: string

  @IsOptional()
  @ValidateNested()
  triggerGroup?: TriggerGroup
}
