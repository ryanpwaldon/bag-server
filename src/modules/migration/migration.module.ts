import { Module } from '@nestjs/common'
import { MigrationService } from './migration.service'
import { EventModule } from 'src/modules/event/event.module'
import { OrderModule } from 'src/modules/order/order.module'
import { ConversionModule } from 'src/modules/conversion/conversion.module'

@Module({
  imports: [EventModule, OrderModule, ConversionModule],
  providers: [MigrationService]
})
export class MigrationModule {}
