import { Module } from '@nestjs/common'
import { SalesService } from './sales.service'
import { BulkOperationModule } from 'src/modules/bulk-operation/bulk-operation.module'

@Module({
  imports: [BulkOperationModule],
  providers: [SalesService],
  exports: [SalesService]
})
export class SalesModule {}
