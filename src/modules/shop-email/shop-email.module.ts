import { Module } from '@nestjs/common'
import { ShopEmailService } from './shop-email.service'
import { UserModule } from 'src/modules/user/user.module'
import { AdminModule } from 'src/modules/admin/admin.module'

@Module({
  providers: [ShopEmailService],
  imports: [AdminModule, UserModule],
  exports: [ShopEmailService]
})
export class ShopEmailModule {}
