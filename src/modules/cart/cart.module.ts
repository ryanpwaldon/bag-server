import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Cart, CartSchema } from 'src/modules/cart/schema/cart.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema
      }
    ])
  ],
  providers: [CartService]
})
export class CartModule {}
