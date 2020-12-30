import { Module } from '@nestjs/common'
import { AdminModule } from 'src/modules/admin/admin.module'
import { UserModule } from 'src/modules/user/user.module'
import { AccessScopeController } from './access-scope.controller'
import { AccessScopeService } from './access-scope.service'

@Module({
  imports: [UserModule, AdminModule],
  controllers: [AccessScopeController],
  providers: [AccessScopeService]
})
export class AccessScopeModule {}
