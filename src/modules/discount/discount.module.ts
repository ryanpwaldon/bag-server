import { Module } from '@nestjs/common'
import { AdminModule } from '../admin/admin.module'
import { DiscountService } from './discount.service'

@Module({
  imports: [AdminModule],
  providers: [DiscountService],
  exports: [DiscountService]
})
export class DiscountModule {}
