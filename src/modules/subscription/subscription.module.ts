import { Module } from '@nestjs/common'
import { SubscriptionController } from './subscription.controller'
import { AdminModule } from '../admin/admin.module'
import { SubscriptionService } from './subscription.service'
import { UserModule } from '../user/user.module'
import { AppUrlModule } from '../app-url/app-url.module'

@Module({
  controllers: [SubscriptionController],
  imports: [AdminModule, UserModule, AppUrlModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
