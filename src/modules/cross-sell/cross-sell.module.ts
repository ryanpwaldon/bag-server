import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { CrossSellService } from './cross-sell.service'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { CrossSellController } from './cross-sell.controller'
import { ProductModule } from 'src/modules/product/product.module'
import { CrossSellSchema, CrossSell } from './schema/cross-sell.schema'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Module({
  imports: [
    UserModule,
    ProductModule,
    MongooseModule.forFeature([
      {
        name: CrossSell.name,
        schema: CrossSellSchema
      }
    ])
  ],
  controllers: [CrossSellController],
  providers: [CrossSellService, EmbeddedAppGuard, PluginGuard],
  exports: [CrossSellService]
})
export class CrossSellModule {}
