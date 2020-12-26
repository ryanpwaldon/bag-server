import { ConversionModule } from 'src/modules/conversion/conversion.module'
import { EventModule } from 'src/modules/event/event.module'
import { CrossSellModule } from 'src/modules/cross-sell/cross-sell.module'
import { AdminModule } from 'src/modules/admin/admin.module'
import { UserModule } from 'src/modules/user/user.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [CrossSellModule, EventModule, AdminModule, UserModule, ConversionModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
