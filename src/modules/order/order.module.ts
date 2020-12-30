import { AdminModule } from 'src/modules/admin/admin.module'
import { UserModule } from 'src/modules/user/user.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [AdminModule, UserModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
