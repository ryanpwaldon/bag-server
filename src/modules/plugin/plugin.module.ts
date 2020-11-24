import { Module } from '@nestjs/common'
import { PluginController } from './plugin.controller'
import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule],
  controllers: [PluginController]
})
export class PluginModule {}
