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
import { TaskModule } from './modules/task/task.module'
import { AdminModule } from './modules/admin/admin.module'
import { EventModule } from './modules/event/event.module'
import { ThemeModule } from './modules/theme/theme.module'
import { AssetModule } from './modules/asset/asset.module'
import { OrderModule } from './modules/order/order.module'
import { SalesModule } from 'src/modules/sales/sales.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PluginModule } from './modules/plugin/plugin.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { ProductModule } from './modules/product/product.module'
import { WebhookModule } from './modules/webhook/webhook.module'
import { VariantModule } from './modules/variant/variant.module'
import { PartnerModule } from './modules/partner/partner.module'
import { SlackModule } from './modules/slack/slack/slack.module'
import { ReferralModule } from './modules/referral/referral.module'
import { AffiliateModule } from './modules/affiliate/affiliate.module'
import { CrossSellModule } from './modules/cross-sell/cross-sell.module'
import { ScriptTagModule } from './modules/script-tag/script-tag.module'
import { ConversionModule } from './modules/conversion/conversion.module'
import { StatisticsModule } from './modules/statistics/statistics.module'
import { TransactionModule } from './modules/transaction/transaction.module'
import { HoneybadgerModule } from './modules/honeybadger/honeybadger.module'
import { MaintenanceModule } from './modules/maintenance/maintenance.module'
import { AccessScopeModule } from './modules/access-scope/access-scope.module'
import { ShopDetailsModule } from './modules/shop-details/shop-details.module'
import { ProgressBarModule } from './modules/progress-bar/progress-bar.module'
import { NotificationModule } from './modules/notification/notification.module'
import { InstallationModule } from './modules/installation/installation.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { ExchangeRateModule } from './modules/exchange-rate/exchange-rate.module'
import { AffiliateCodeModule } from './modules/affiliate-code/affiliate-code.module'
import { BulkOperationModule } from 'src/modules/bulk-operation/bulk-operation.module'

const imports = [
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
  MailModule,
  TaskModule,
  AdminModule,
  EventModule,
  ThemeModule,
  AssetModule,
  SalesModule,
  SlackModule,
  OrderModule,
  PluginModule,
  VariantModule,
  MonitorModule,
  WebhookModule,
  ProductModule,
  PartnerModule,
  ReferralModule,
  ScriptTagModule,
  CrossSellModule,
  AffiliateModule,
  StatisticsModule,
  ConversionModule,
  AccessScopeModule,
  HoneybadgerModule,
  ShopDetailsModule,
  TransactionModule,
  ProgressBarModule,
  MaintenanceModule,
  ExchangeRateModule,
  SubscriptionModule,
  InstallationModule,
  NotificationModule,
  BulkOperationModule,
  AffiliateCodeModule
]

if (process.env.SCHEDULER_ENABLED === 'true') imports.push(ScheduleModule.forRoot())

@Module({ imports })
export class AppModule {}
