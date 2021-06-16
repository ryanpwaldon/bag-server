import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { PartnerModule } from 'src/modules/partner/partner.module'

@Module({
  imports: [PartnerModule],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}
