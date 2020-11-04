import { Module } from '@nestjs/common'
import { CrossSellController } from './cross-sell.controller'
import { CrossSellService } from './cross-sell.service'

@Module({
  controllers: [CrossSellController],
  providers: [CrossSellService]
})
export class CrossSellModule {}
