import { Module } from '@nestjs/common'
import { AdminSubscriptionController } from './admin-subscription.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { AdminSubscriptionService } from './admin-subscription.service'
import { UserModule } from '../user/user.module'
import { AdminMetaModule } from '../admin-meta/admin-meta.module'

@Module({
  controllers: [AdminSubscriptionController],
  imports: [ShopifyModule, UserModule, AdminMetaModule],
  providers: [AdminSubscriptionService],
  exports: [AdminSubscriptionService]
})
export class AdminSubscriptionModule {}
