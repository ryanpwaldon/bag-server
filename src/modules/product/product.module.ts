import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { AdminModule } from '../admin/admin.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [AdminModule, UserModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
