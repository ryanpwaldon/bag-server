import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { AdminModule } from '../admin/admin.module'
import { AppUrlModule } from '../app-url/app-url.module'
import { WebhookModule } from '../webhook/webhook.module'
import { InstallationService } from './installation.service'
import { ScriptTagModule } from '../script-tag/script-tag.module'
import { InstallationController } from './installation.controller'
import { SubscriptionModule } from '../subscription/subscription.module'
import { CartModule } from 'src/modules/cart/cart.module'

@Module({
  imports: [AdminModule, UserModule, AppUrlModule, WebhookModule, ScriptTagModule, SubscriptionModule, CartModule],
  controllers: [InstallationController],
  providers: [InstallationService],
  exports: [InstallationService]
})
export class InstallationModule {}
