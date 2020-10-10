import { Module } from '@nestjs/common'
import { MetaService } from './meta.service'
import { MetaController } from './meta.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { UserModule } from '../user/user.module'

@Module({
  providers: [MetaService],
  controllers: [MetaController],
  imports: [ShopifyModule, UserModule],
  exports: [MetaService]
})
export class MetaModule {}
