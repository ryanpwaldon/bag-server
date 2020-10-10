import { Module } from '@nestjs/common'
import { ShopifyModule } from '../shopify/shopify.module'
import { DiscountService } from './discount.service'

@Module({
  imports: [ShopifyModule],
  providers: [DiscountService],
  exports: [DiscountService]
})
export class DiscountModule {}
