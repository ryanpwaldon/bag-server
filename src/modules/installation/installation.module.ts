import { UserModule } from '../user/user.module'
import { AdminModule } from '../admin/admin.module'
import { HttpModule, Module } from '@nestjs/common'
import { AppUrlModule } from '../app-url/app-url.module'
import { WebhookModule } from '../webhook/webhook.module'
import { InstallationController } from './installation.controller'
import { SubscriptionModule } from '../subscription/subscription.module'
import { CartModule } from 'src/modules/cart/cart.module'

@Module({
  imports: [HttpModule, UserModule, CartModule, AdminModule, AppUrlModule, WebhookModule, SubscriptionModule],
  controllers: [InstallationController]
})
export class InstallationModule {}
