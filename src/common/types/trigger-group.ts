import { IsBoolean, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator'

export enum TriggerProperty {
  Product = 'product',
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
  @ValidateNested()
  triggers!: Array<TriggerGroup | Trigger>
}
