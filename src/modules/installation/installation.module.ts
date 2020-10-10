import { Module } from '@nestjs/common'
import { InstallationService } from './installation.service'
import { InstallationController } from './installation.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { UserModule } from '../user/user.module'
import { MetaModule } from '../meta/meta.module'
import { WebhookModule } from '../webhook/webhook.module'
import { ScriptTagModule } from '../script-tag/script-tag.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { PluginModule } from '../plugin/plugin.module'

@Module({
  providers: [InstallationService],
  controllers: [InstallationController],
  imports: [ShopifyModule, UserModule, MetaModule, WebhookModule, ScriptTagModule, SubscriptionModule, PluginModule],
  exports: [InstallationService]
})
export class InstallationModule {}
