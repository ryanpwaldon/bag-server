import { Module } from '@nestjs/common'
import { InstallationService } from './installation.service'
import { InstallationController } from './installation.controller'
import { AdminModule } from '../admin/admin.module'
import { UserModule } from '../user/user.module'
import { AdminMetaModule } from '../admin-meta/admin-meta.module'
import { WebhookModule } from '../webhook/webhook.module'
import { AdminScriptTagModule } from '../admin-script-tag/admin-script-tag.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { PluginModule } from '../plugin/plugin.module'

@Module({
  providers: [InstallationService],
  controllers: [InstallationController],
  imports: [
    AdminModule,
    UserModule,
    AdminMetaModule,
    WebhookModule,
    AdminScriptTagModule,
    SubscriptionModule,
    PluginModule
  ],
  exports: [InstallationService]
})
export class InstallationModule {}
