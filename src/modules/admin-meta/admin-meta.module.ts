import { Module } from '@nestjs/common'
import { AdminMetaService } from './admin-meta.service'
import { AdminMetaController } from './admin-meta.controller'
import { AdminModule } from '../admin/admin.module'
import { UserModule } from '../user/user.module'

@Module({
  providers: [AdminMetaService],
  controllers: [AdminMetaController],
  imports: [AdminModule, UserModule],
  exports: [AdminMetaService]
})
export class AdminMetaModule {}
