import { CartEventModule } from 'src/modules/cart-event/cart-event.module'
import { CrossSellModule } from 'src/modules/cross-sell/cross-sell.module'
import { AdminModule } from 'src/modules/admin/admin.module'
import { UserModule } from 'src/modules/user/user.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [CrossSellModule, CartEventModule, AdminModule, UserModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
