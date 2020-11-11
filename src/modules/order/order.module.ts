import { Module } from '@nestjs/common'
import { CartEventModule } from 'src/modules/cart-event/cart-event.module'
import { CrossSellModule } from 'src/modules/cross-sell/cross-sell.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  imports: [CrossSellModule, CartEventModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
