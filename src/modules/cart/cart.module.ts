import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CartController } from './cart.controller'
import { UserModule } from 'src/modules/user/user.module'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { ThemeModule } from 'src/modules/theme/theme.module'
import { AssetModule } from 'src/modules/asset/asset.module'
import { Cart, CartSchema } from 'src/modules/cart/schema/cart.schema'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { ScriptTagModule } from 'src/modules/script-tag/script-tag.module'

@Module({
  imports: [
    UserModule,
    ThemeModule,
    AssetModule,
    ScriptTagModule,
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
