import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Cart, CartSchema } from 'src/modules/cart/schema/cart.schema'
import { CartController } from './cart.controller'
import { UserModule } from 'src/modules/user/user.module'

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
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController]
})
export class CartModule {}
