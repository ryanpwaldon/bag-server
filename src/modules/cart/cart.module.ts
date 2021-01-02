import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CartController } from './cart.controller'
import { UserModule } from 'src/modules/user/user.module'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { Cart, CartSchema } from 'src/modules/cart/schema/cart.schema'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

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
  providers: [CartService, EmbeddedAppGuard, PluginGuard],
  exports: [CartService]
})
export class CartModule {}
