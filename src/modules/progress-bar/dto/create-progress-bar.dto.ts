import { TriggerGroup } from 'src/common/types/trigger-group'
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreateProgressBarDto {
  @IsNotEmpty()
  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  completionMessage?: string

  @IsNotEmpty()
  @IsNumber()
  goal!: number

  @IsNotEmpty()
  @IsString()
  image!: string

  @IsOptional()
  @ValidateNested()
  triggerGroup?: TriggerGroup
}
