import { Module } from '@nestjs/common'
import { SalesService } from './sales.service'
import { ExchangeRateModule } from 'src/modules/exchange-rate/exchange-rate.module'
import { BulkOperationModule } from 'src/modules/bulk-operation/bulk-operation.module'

@Module({
  imports: [BulkOperationModule, ExchangeRateModule],
  providers: [SalesService],
  exports: [SalesService]
})
export class SalesModule {}
