import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

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
}
