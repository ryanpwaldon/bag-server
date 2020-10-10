import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [ShopifyModule, UserModule],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
