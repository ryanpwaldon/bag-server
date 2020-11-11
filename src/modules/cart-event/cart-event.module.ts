import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CartEvent, CartEventSchema } from 'src/modules/cart-event/schema/cart-event.schema'
import { UserModule } from 'src/modules/user/user.module'
import { CartEventController } from './cart-event.controller'
import { CartEventService } from './cart-event.service'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: CartEvent.name,
        schema: CartEventSchema
      }
    ])
  ],
  controllers: [CartEventController],
  providers: [CartEventService]
})
export class CartEventModule {}
