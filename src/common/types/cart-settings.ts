import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CartSettings {
  @IsOptional()
  @IsString()
  colorBackdrop = '#000000'

  @IsOptional()
  @IsString()
  colorBackground = '#F5F5F5'

  @IsOptional()
  @IsString()
  colorBorderPrimary = '#E5E5E5'

  @IsOptional()
  @IsString()
  colorButtonPrimaryBackground = '#171717'

  @IsOptional()
  @IsString()
  colorButtonPrimaryText = '#FFFFFF'

  @IsOptional()
  @IsString()
  colorProgressBarPrimary = '#404040'

  @IsOptional()
  @IsString()
  colorTextLink = '#2563EB'

  @IsOptional()
  @IsString()
  colorTextPrimary = '#171717'

  @IsOptional()
  @IsString()
  colorTextSecondary = '#737373'

  @IsOptional()
  @IsBoolean()
  displayBorders = false

  @IsOptional()
  @IsBoolean()
  displayShadows = true

  @IsOptional()
  @IsNumber()
  opacityBackdrop = 0.5

  @IsOptional()
  @IsNumber()
  paddingCart = 0

  @IsOptional()
  @IsBoolean()
  roundedCorners = true
}
