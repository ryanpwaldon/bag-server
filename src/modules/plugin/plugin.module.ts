import { Module } from '@nestjs/common'
import { CartModule } from 'src/modules/cart/cart.module'
import { UserModule } from 'src/modules/user/user.module'
import { PluginController } from './plugin.controller'

@Module({
  imports: [UserModule, CartModule],
  controllers: [PluginController]
})
export class PluginModule {}
