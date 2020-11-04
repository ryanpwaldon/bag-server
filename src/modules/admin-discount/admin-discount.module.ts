import { Module } from '@nestjs/common'
import { ShopifyModule } from '../shopify/shopify.module'
import { AdminDiscountService } from './admin-discount.service'

@Module({
  imports: [ShopifyModule],
  providers: [AdminDiscountService],
  exports: [AdminDiscountService]
})
export class AdminDiscountModule {}
