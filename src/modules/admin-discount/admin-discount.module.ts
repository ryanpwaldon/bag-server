import { Module } from '@nestjs/common'
import { AdminModule } from '../admin/admin.module'
import { AdminDiscountService } from './admin-discount.service'

@Module({
  imports: [AdminModule],
  providers: [AdminDiscountService],
  exports: [AdminDiscountService]
})
export class AdminDiscountModule {}
