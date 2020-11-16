import { Module } from '@nestjs/common'
import { InstallationService } from './installation.service'
import { InstallationController } from './installation.controller'
import { AdminModule } from '../admin/admin.module'
import { UserModule } from '../user/user.module'
import { AppUrlModule } from '../app-url/app-url.module'
import { WebhookModule } from '../webhook/webhook.module'
import { ScriptTagModule } from '../script-tag/script-tag.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { PluginModule } from '../plugin/plugin.module'
import { CartModule } from 'src/modules/cart/cart.module'

@Module({
  providers: [InstallationService],
  controllers: [InstallationController],
  imports: [
    AdminModule,
    UserModule,
    AppUrlModule,
    WebhookModule,
    ScriptTagModule,
    SubscriptionModule,
    PluginModule,
    CartModule
  ],
  exports: [InstallationService]
})
export class InstallationModule {}
