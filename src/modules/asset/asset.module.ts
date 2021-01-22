import { Module } from '@nestjs/common'
import { AssetService } from './asset.service'
import { UserModule } from 'src/modules/user/user.module'
import { AdminModule } from 'src/modules/admin/admin.module'

@Module({
  imports: [AdminModule, UserModule],
  providers: [AssetService],
  exports: [AssetService]
})
export class AssetModule {}
