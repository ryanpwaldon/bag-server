import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CartController } from './cart.controller'
import { UserModule } from 'src/modules/user/user.module'
import { Cart, CartSchema } from 'src/modules/cart/schema/cart.schema'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema
      }
    ])
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule {}
