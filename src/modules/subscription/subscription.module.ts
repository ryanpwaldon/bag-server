import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { AdminModule } from '../admin/admin.module'
import { SubscriptionService } from './subscription.service'
import { SubscriptionController } from './subscription.controller'

@Module({
  controllers: [SubscriptionController],
  imports: [AdminModule, UserModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
