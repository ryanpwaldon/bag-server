import { Module } from '@nestjs/common'
import { AdminSubscriptionController } from './admin-subscription.controller'
import { AdminModule } from '../admin/admin.module'
import { AdminSubscriptionService } from './admin-subscription.service'
import { UserModule } from '../user/user.module'
import { AdminMetaModule } from '../admin-meta/admin-meta.module'

@Module({
  controllers: [AdminSubscriptionController],
  imports: [AdminModule, UserModule, AdminMetaModule],
  providers: [AdminSubscriptionService],
  exports: [AdminSubscriptionService]
})
export class AdminSubscriptionModule {}