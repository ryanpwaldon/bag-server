import { Module } from '@nestjs/common'
import { SubscriptionController } from './subscription.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { SubscriptionService } from './subscription.service'
import { UserModule } from '../user/user.module'
import { AdminMetaModule } from '../admin-meta/admin-meta.module'

@Module({
  controllers: [SubscriptionController],
  imports: [ShopifyModule, UserModule, AdminMetaModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
