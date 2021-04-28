import { Module } from '@nestjs/common'
import { TestService } from './test.service'
import { UserModule } from 'src/modules/user/user.module'
import { SalesModule } from 'src/modules/sales/sales.module'

@Module({
  imports: [UserModule, SalesModule],
  providers: [TestService]
})
export class TestModule {}
