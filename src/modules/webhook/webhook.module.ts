import { Module } from '@nestjs/common'
import { AdminModule } from '../admin/admin.module'
import { WebhookService } from './webhook.service'
import { WebhookController } from './webhook.controller'
import { UserModule } from 'src/modules/user/user.module'
import { CartModule } from 'src/modules/cart/cart.module'
import { ConversionModule } from 'src/modules/conversion/conversion.module'
import { SubscriptionModule } from 'src/modules/subscription/subscription.module'

@Module({
  imports: [AdminModule, ConversionModule, UserModule, SubscriptionModule, CartModule],
  providers: [WebhookService],
  exports: [WebhookService],
  controllers: [WebhookController]
})
export class WebhookModule {}
