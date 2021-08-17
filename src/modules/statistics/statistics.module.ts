import { Module } from '@nestjs/common'
import { UserModule } from 'src/modules/user/user.module'
import { StatisticsController } from './statistics.controller'
import { ConversionModule } from 'src/modules/conversion/conversion.module'

@Module({
  imports: [ConversionModule, UserModule],
  controllers: [StatisticsController]
})
export class StatisticsModule {}
