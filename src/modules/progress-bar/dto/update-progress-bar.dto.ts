import { IsNumber, IsOptional, IsString } from 'class-validator'

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
}
