import { Module } from '@nestjs/common'
import { ShopifyModule } from '../shopify/shopify.module'
import { AdminWebhookService } from './admin-webhook.service'

@Module({
  imports: [ShopifyModule],
  providers: [AdminWebhookService],
  exports: [AdminWebhookService]
})
export class AdminWebhookModule {}
