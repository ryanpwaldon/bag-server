import { Module } from '@nestjs/common'
import { ShopifyModule } from '../shopify/shopify.module'
import { ScriptTagService } from './script-tag.service'

@Module({
  imports: [ShopifyModule],
  providers: [ScriptTagService],
  exports: [ScriptTagService]
})
export class ScriptTagModule {}
