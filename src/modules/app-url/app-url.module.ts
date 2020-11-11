import { Module } from '@nestjs/common'
import { AppUrlService } from './app-url.service'
import { AppUrlController } from './app-url.controller'
import { AdminModule } from '../admin/admin.module'
import { UserModule } from '../user/user.module'

@Module({
  providers: [AppUrlService],
  controllers: [AppUrlController],
  imports: [AdminModule, UserModule],
  exports: [AppUrlService]
})
export class AppUrlModule {}
