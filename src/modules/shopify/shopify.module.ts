import { Module, HttpModule } from '@nestjs/common'
import { ShopifyService } from './shopify.service'

@Module({
  imports: [HttpModule],
  providers: [ShopifyService],
  exports: [ShopifyService]
})
export class ShopifyModule {}
