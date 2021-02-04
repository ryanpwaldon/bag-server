import { Module } from '@nestjs/common'
import { ShopDetailsService } from './shop-details.service'
import { UserModule } from 'src/modules/user/user.module'
import { AdminModule } from 'src/modules/admin/admin.module'

@Module({
  providers: [ShopDetailsService],
  imports: [AdminModule, UserModule],
  exports: [ShopDetailsService]
})
export class ShopDetailsModule {}
