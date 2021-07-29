import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CartSettings {
  @IsOptional()
  @IsString()
  backdropColor = '#000000'

  @IsOptional()
  @IsNumber()
  backdropOpacity = 0.5

  @IsOptional()
  @IsString()
  borderColor1 = '#E5E5E5'

  @IsOptional()
  @IsNumber()
  brightness1 = 0.1

  @IsOptional()
  @IsNumber()
  cartPadding = 0

  @IsOptional()
  @IsBoolean()
  roundCorners = true

  @IsOptional()
  @IsBoolean()
  showBorders = false

  @IsOptional()
  @IsBoolean()
  showShadows = true

  @IsOptional()
  @IsString()
  textColor1 = '#171717'

  @IsOptional()
  @IsString()
  textColor2 = '#737373'

  @IsOptional()
  @IsString()
  textColor3 = '#ffffff'

  @IsOptional()
  @IsString()
  themeColor1 = '#F5F5F5'

  @IsOptional()
  @IsString()
  themeColor2 = '#ffffff'

  @IsOptional()
  @IsString()
  themeColor3 = '#2563EB'
}
