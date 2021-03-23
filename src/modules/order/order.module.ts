import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { MongooseModule } from '@nestjs/mongoose'
import { OrderController } from './order.controller'
import { UserModule } from 'src/modules/user/user.module'
import { Order, OrderSchema } from 'src/modules/order/schema/order.schema'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema
      }
    ])
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {}
