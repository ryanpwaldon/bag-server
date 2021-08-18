import { Module } from '@nestjs/common'
import { UserModule } from 'src/modules/user/user.module'
import { StatisticsController } from './statistics.controller'
import { CrossSellModule } from 'src/modules/cross-sell/cross-sell.module'
import { ConversionModule } from 'src/modules/conversion/conversion.module'
import { ProgressBarModule } from 'src/modules/progress-bar/progress-bar.module'

@Module({
  imports: [ConversionModule, UserModule, CrossSellModule, ProgressBarModule],
  controllers: [StatisticsController]
})
export class StatisticsModule {}
