import { Module } from '@nestjs/common'
import { AdminModule } from '../admin/admin.module'
import { ScriptTagService } from './script-tag.service'

@Module({
  imports: [AdminModule],
  providers: [ScriptTagService],
  exports: [ScriptTagService]
})
export class ScriptTagModule {}
