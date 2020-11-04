import { Module } from '@nestjs/common'
import { AdminModule } from '../admin/admin.module'
import { AdminWebhookService } from './admin-webhook.service'

@Module({
  imports: [AdminModule],
  providers: [AdminWebhookService],
  exports: [AdminWebhookService]
})
export class AdminWebhookModule {}
