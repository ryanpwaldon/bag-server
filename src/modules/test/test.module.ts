import { Module } from '@nestjs/common'
import { TestService } from './test.service'
import { UserModule } from 'src/modules/user/user.module'
import { SalesModule } from 'src/modules/sales/sales.module'
import { SubscriptionModule } from 'src/modules/subscription/subscription.module'

@Module({
  imports: [UserModule, SalesModule, SubscriptionModule],
  providers: [TestService]
})
export class TestModule {}
