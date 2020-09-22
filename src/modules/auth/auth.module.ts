import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { InstallationModule } from '../installation/installation.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { PluginModule } from '../plugin/plugin.module'

@Module({
  imports: [UserModule, InstallationModule, SubscriptionModule, PluginModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
