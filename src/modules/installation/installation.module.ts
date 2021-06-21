import { UserModule } from '../user/user.module'
import { AdminModule } from '../admin/admin.module'
import { HttpModule, Module } from '@nestjs/common'
import { WebhookModule } from '../webhook/webhook.module'
import { MailModule } from 'src/modules/mail/mail.module'
import { CartModule } from 'src/modules/cart/cart.module'
import { InstallationController } from './installation.controller'
import { SlackModule } from 'src/modules/slack/slack/slack.module'
import { AffiliateModule } from 'src/modules/affiliate/affiliate.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { ShopDetailsModule } from 'src/modules/shop-details/shop-details.module'
import { NotificationModule } from 'src/modules/notification/notification.module'
import { AffiliateCodeModule } from 'src/modules/affiliate-code/affiliate-code.module'

@Module({
  imports: [
    HttpModule,
    UserModule,
    CartModule,
    MailModule,
    SlackModule,
    AdminModule,
    WebhookModule,
    AffiliateModule,
    ShopDetailsModule,
    NotificationModule,
    SubscriptionModule,
    AffiliateCodeModule
  ],
  controllers: [InstallationController]
})
export class InstallationModule {}
