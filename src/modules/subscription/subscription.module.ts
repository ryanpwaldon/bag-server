import { Module } from '@nestjs/common'
import { SubscriptionController } from './subscription.controller'
import { AdminModule } from '../admin/admin.module'
import { SubscriptionService } from './subscription.service'
import { UserModule } from '../user/user.module'
import { AdminMetaModule } from '../admin-meta/admin-meta.module'

@Module({
  controllers: [SubscriptionController],
  imports: [AdminModule, UserModule, AdminMetaModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
