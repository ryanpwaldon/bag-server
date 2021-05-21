import { HttpModule, Module } from '@nestjs/common'
import { ExchangeRateService } from './exchange-rate.service'

@Module({
  imports: [HttpModule],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService]
})
export class ExchangeRateModule {}
