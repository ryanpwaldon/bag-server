import { Module } from '@nestjs/common'
import { AdminProductService } from './admin-product.service'
import { AdminProductController } from './admin-product.controller'
import { AdminModule } from '../admin/admin.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [AdminModule, UserModule],
  providers: [AdminProductService],
  controllers: [AdminProductController],
  exports: [AdminProductService]
})
export class AdminProductModule {}
