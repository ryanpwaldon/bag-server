import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { InstallationModule } from '../installation/installation.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { WidgetModule } from '../widget/widget.module'

@Module({
  imports: [UserModule, InstallationModule, SubscriptionModule, WidgetModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
