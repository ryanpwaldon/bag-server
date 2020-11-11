import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator'
import { CartEventType } from 'src/modules/cart-event/schema/cart-event.schema'

export class CreateCartEventDto {
  @IsNotEmpty()
  @IsString()
  cartToken!: string

  @IsString()
  @IsNotEmpty()
  @IsEnum(CartEventType)
  type!: CartEventType

  @IsObject()
  @IsNotEmpty()
  meta!: any
}
