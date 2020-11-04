import { Module } from '@nestjs/common'
import { InstallationService } from './installation.service'
import { InstallationController } from './installation.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { UserModule } from '../user/user.module'
import { AdminMetaModule } from '../admin-meta/admin-meta.module'
import { AdminWebhookModule } from '../admin-webhook/admin-webhook.module'
import { AdminScriptTagModule } from '../admin-script-tag/admin-script-tag.module'
import { AdminSubscriptionModule } from '../admin-subscription/admin-subscription.module'
import { PluginModule } from '../plugin/plugin.module'

@Module({
  providers: [InstallationService],
  controllers: [InstallationController],
  imports: [
    ShopifyModule,
    UserModule,
    AdminMetaModule,
    AdminWebhookModule,
    AdminScriptTagModule,
    AdminSubscriptionModule,
    PluginModule
  ],
  exports: [InstallationService]
})
export class InstallationModule {}
