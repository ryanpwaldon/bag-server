import { Module } from '@nestjs/common'
import { AdminMetaService } from './admin-meta.service'
import { AdminMetaController } from './admin-meta.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { UserModule } from '../user/user.module'

@Module({
  providers: [AdminMetaService],
  controllers: [AdminMetaController],
  imports: [ShopifyModule, UserModule],
  exports: [AdminMetaService]
})
export class AdminMetaModule {}
