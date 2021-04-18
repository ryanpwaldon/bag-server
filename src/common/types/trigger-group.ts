import { IsArray, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator'

export enum TriggerProperty {
  Product = 'product',
  ProductTag = 'productTag',
  ProductType = 'productType',
  ProductVendor = 'productVendor',
  Subtotal = 'subtotal'
}

export enum TriggerCondition {
  Includes = 'includes',
  DoesNotInclude = 'doesNotInclude',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan'
}

class Trigger {
  @IsNotEmpty()
  @IsEnum(TriggerProperty)
  property!: TriggerProperty

  @IsNotEmpty()
  @IsEnum(TriggerProperty)
  condition!: TriggerCondition

  @IsNotEmpty()
  @IsEnum(TriggerProperty)
  value!: string | string[] | number
}

export class TriggerGroup {
  @IsNotEmpty()
  @IsBoolean()
  matchAll!: boolean

  @IsNotEmpty()
  @IsArray()
  triggers!: Array<TriggerGroup | Trigger>
}
