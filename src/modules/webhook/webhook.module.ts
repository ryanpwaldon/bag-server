import { Module } from '@nestjs/common'
import { AdminModule } from '../admin/admin.module'
import { WebhookService } from './webhook.service'

@Module({
  imports: [AdminModule],
  providers: [WebhookService],
  exports: [WebhookService]
})
export class WebhookModule {}
