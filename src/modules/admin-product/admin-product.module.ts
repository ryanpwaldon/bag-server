import { Module } from '@nestjs/common'
import { AdminProductService } from './admin-product.service'
import { AdminProductController } from './admin-product.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [ShopifyModule, UserModule],
  providers: [AdminProductService],
  controllers: [AdminProductController]
})
export class AdminProductModule {}
