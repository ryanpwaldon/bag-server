import { Module } from '@nestjs/common'
import { AdminModule } from '../admin/admin.module'
import { AdminScriptTagService } from './admin-script-tag.service'

@Module({
  imports: [AdminModule],
  providers: [AdminScriptTagService],
  exports: [AdminScriptTagService]
})
export class AdminScriptTagModule {}
