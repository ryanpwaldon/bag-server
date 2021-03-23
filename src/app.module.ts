import prettifier from 'pino-colada'
import { Module } from '@nestjs/common'
import paginate from 'mongoose-paginate'
import { LoggerModule } from 'nestjs-pino'
import config from 'src/modules/config/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import autopopulate from 'mongoose-autopopulate'
import { MongooseModule } from '@nestjs/mongoose'
import { SENTRY_DSN } from 'src/common/constants'
import { ScheduleModule } from '@nestjs/schedule'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { CartModule } from './modules/cart/cart.module'
import { GdprModule } from './modules/gdpr/gdpr.module'
import { LeadModule } from './modules/lead/lead.module'
import { MailModule } from './modules/mail/mail.module'
import { UserModule } from './modules/user/user.module'
import { AdminModule } from './modules/admin/admin.module'
import { EventModule } from './modules/event/event.module'
import { SentryInterceptor } from '@ntegral/nestjs-sentry'
import { ThemeModule } from './modules/theme/theme.module'
import { AssetModule } from './modules/asset/asset.module'
import { OrderModule } from './modules/order/order.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PluginModule } from './modules/plugin/plugin.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { ProductModule } from './modules/product/product.module'
import { WebhookModule } from './modules/webhook/webhook.module'
import { DiscountModule } from './modules/discount/discount.module'
import { CrossSellModule } from './modules/cross-sell/cross-sell.module'
import { ScriptTagModule } from './modules/script-tag/script-tag.module'
import { ConversionModule } from './modules/conversion/conversion.module'
import { AccessScopeModule } from './modules/access-scope/access-scope.module'
import { NotificationModule } from './modules/notification/notification.module'
import { InstallationModule } from './modules/installation/installation.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { ShopDetailsModule } from './modules/shop-details/shop-details.module'
import { ProgressBarModule } from './modules/progress-bar/progress-bar.module'
import { MigrationModule } from './modules/migration/migration.module'

@Module({
  imports: [
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        debug: true,
        dsn: SENTRY_DSN,
        tracesSampleRate: 1.0,
        environment: configService.get('APP_ENV')
      })
    }),
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
    ScheduleModule.forRoot(),
    UserModule,
    AdminModule,
    SubscriptionModule,
    InstallationModule,
    GdprModule,
    MonitorModule,
    DiscountModule,
    WebhookModule,
    ScriptTagModule,
    ProductModule,
    CrossSellModule,
    EventModule,
    CartModule,
    LeadModule,
    MailModule,
    ConversionModule,
    AccessScopeModule,
    PluginModule,
    ThemeModule,
    AssetModule,
    NotificationModule,
    ShopDetailsModule,
    ProgressBarModule,
    OrderModule,
    MigrationModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor
    }
  ]
})
export class AppModule {}
