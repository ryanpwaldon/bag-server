import { Module } from '@nestjs/common'
import { ShopifyModule } from '../shopify/shopify.module'
import { WebhookService } from './webhook.service'

@Module({
  imports: [ShopifyModule],
  providers: [WebhookService],
  exports: [WebhookService]
})
export class WebhookModule {}
