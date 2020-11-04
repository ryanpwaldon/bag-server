import { Module } from '@nestjs/common'
import { ShopifyModule } from '../shopify/shopify.module'
import { AdminScriptTagService } from './admin-script-tag.service'

@Module({
  imports: [ShopifyModule],
  providers: [AdminScriptTagService],
  exports: [AdminScriptTagService]
})
export class AdminScriptTagModule {}
