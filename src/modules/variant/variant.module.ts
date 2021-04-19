import { Module } from '@nestjs/common'
import { VariantService } from './variant.service'
import { VariantController } from './variant.controller'
import { UserModule } from 'src/modules/user/user.module'
import { AdminModule } from 'src/modules/admin/admin.module'

@Module({
  imports: [AdminModule, UserModule],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService]
})
export class VariantModule {}
