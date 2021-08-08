import { Module } from '@nestjs/common'
import { UserModule } from 'src/modules/user/user.module'
import { MaintenanceService } from './maintenance.service'
import { EventModule } from 'src/modules/event/event.module'
import { OrderModule } from 'src/modules/order/order.module'
import { ProductModule } from 'src/modules/product/product.module'
import { CrossSellModule } from 'src/modules/cross-sell/cross-sell.module'
import { ConversionModule } from 'src/modules/conversion/conversion.module'
import { ProgressBarModule } from 'src/modules/progress-bar/progress-bar.module'

@Module({
  imports: [UserModule, CrossSellModule, ProgressBarModule, ProductModule, ConversionModule, EventModule, OrderModule],
  providers: [MaintenanceService]
})
export class MaintenanceModule {}
