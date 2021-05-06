import { UserModule } from '../user/user.module'
import { AdminModule } from '../admin/admin.module'
import { HttpModule, Module } from '@nestjs/common'
import { WebhookModule } from '../webhook/webhook.module'
import { MailModule } from 'src/modules/mail/mail.module'
import { CartModule } from 'src/modules/cart/cart.module'
import { InstallationController } from './installation.controller'
import { SubscriptionModule } from '../subscription/subscription.module'
import { ShopDetailsModule } from 'src/modules/shop-details/shop-details.module'

@Module({
  imports: [
    HttpModule,
    UserModule,
    CartModule,
    MailModule,
    AdminModule,
    WebhookModule,
    ShopDetailsModule,
    SubscriptionModule
  ],
  controllers: [InstallationController]
})
export class InstallationModule {}
