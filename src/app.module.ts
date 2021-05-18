import prettifier from 'pino-colada'
import { Module } from '@nestjs/common'
import paginate from 'mongoose-paginate'
import { LoggerModule } from 'nestjs-pino'
import config from 'src/modules/config/config'
import autopopulate from 'mongoose-autopopulate'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { CartModule } from './modules/cart/cart.module'
import { GdprModule } from './modules/gdpr/gdpr.module'
import { MailModule } from './modules/mail/mail.module'
import { UserModule } from './modules/user/user.module'
import { TestModule } from './modules/test/test.module'
import { AdminModule } from './modules/admin/admin.module'
import { EventModule } from './modules/event/event.module'
import { ThemeModule } from './modules/theme/theme.module'
import { AssetModule } from './modules/asset/asset.module'
import { OrderModule } from './modules/order/order.module'
import { SalesModule } from 'src/modules/sales/sales.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PluginModule } from './modules/plugin/plugin.module'
import { CouponModule } from './modules/coupon/coupon.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { ProductModule } from './modules/product/product.module'
import { WebhookModule } from './modules/webhook/webhook.module'
import { VariantModule } from './modules/variant/variant.module'
import { CrossSellModule } from './modules/cross-sell/cross-sell.module'
import { ScriptTagModule } from './modules/script-tag/script-tag.module'
import { ConversionModule } from './modules/conversion/conversion.module'
import { AccessScopeModule } from './modules/access-scope/access-scope.module'
import { ShopDetailsModule } from './modules/shop-details/shop-details.module'
import { ProgressBarModule } from './modules/progress-bar/progress-bar.module'
import { NotificationModule } from './modules/notification/notification.module'
import { InstallationModule } from './modules/installation/installation.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { BulkOperationModule } from 'src/modules/bulk-operation/bulk-operation.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.APP_ENV}`,
      load: [config],
      isGlobal: true
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          prettifier,
          level: configService.get('APP_ENV') === 'development' ? 'debug' : 'info',
          prettyPrint: configService.get('APP_ENV') === 'development'
        }
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useFindAndModify: false,
        useCreateIndex: true,
        connectionFactory: connection => {
          connection.plugin(paginate)
          connection.plugin(autopopulate)
          return connection
        }
      })
    }),
    UserModule,
    GdprModule,
    CartModule,
    TestModule,
    MailModule,
    AdminModule,
    EventModule,
    ThemeModule,
    AssetModule,
    SalesModule,
    OrderModule,
    PluginModule,
    CouponModule,
    VariantModule,
    MonitorModule,
    WebhookModule,
    ProductModule,
    ScriptTagModule,
    CrossSellModule,
    ConversionModule,
    AccessScopeModule,
    ShopDetailsModule,
    ProgressBarModule,
    SubscriptionModule,
    InstallationModule,
    NotificationModule,
    BulkOperationModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule {}
