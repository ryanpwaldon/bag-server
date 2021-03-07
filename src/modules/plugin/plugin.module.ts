import { Module } from '@nestjs/common'
import { PluginController } from './plugin.controller'
import { UserModule } from 'src/modules/user/user.module'
import { CrossSellModule } from 'src/modules/cross-sell/cross-sell.module'
import { ProgressBarModule } from 'src/modules/progress-bar/progress-bar.module'

@Module({
  imports: [UserModule, CrossSellModule, ProgressBarModule],
  controllers: [PluginController]
})
export class PluginModule {}
