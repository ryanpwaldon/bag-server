import { UserModule } from '../user/user.module'
import { AdminModule } from '../admin/admin.module'
import { HttpModule, Module } from '@nestjs/common'
import { WebhookModule } from '../webhook/webhook.module'
import { CartModule } from 'src/modules/cart/cart.module'
import { SalesModule } from 'src/modules/sales/sales.module'
import { InstallationController } from './installation.controller'
import { SubscriptionModule } from '../subscription/subscription.module'
import { ShopDetailsModule } from 'src/modules/shop-details/shop-details.module'

@Module({
  imports: [
    HttpModule,
    UserModule,
    CartModule,
    AdminModule,
    SalesModule,
    WebhookModule,
    ShopDetailsModule,
    SubscriptionModule
  ],
  controllers: [InstallationController]
})
export class InstallationModule {}
