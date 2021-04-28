import { HttpModule, Module } from '@nestjs/common'
import { AdminModule } from 'src/modules/admin/admin.module'
import { BulkOperationService } from './bulk-operation.service'

@Module({
  imports: [HttpModule, AdminModule],
  providers: [BulkOperationService],
  exports: [BulkOperationService]
})
export class BulkOperationModule {}
