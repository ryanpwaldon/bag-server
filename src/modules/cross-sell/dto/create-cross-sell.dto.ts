import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateCrossSellDto {
  @IsNotEmpty()
  @IsString()
  title!: string

  @IsNotEmpty()
  @IsString()
  subtitle!: string

  @IsNotEmpty()
  @IsString()
  adminProductId!: string

  @IsNotEmpty()
  @IsString({ each: true })
  triggers!: string[]

  @IsNotEmpty()
  @IsBoolean()
  active!: boolean
}
