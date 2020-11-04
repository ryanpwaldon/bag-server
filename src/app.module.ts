import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from './modules/user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ShopifyModule } from './modules/shopify/shopify.module'
import { OfferModule } from './modules/offer/offer.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { InstallationModule } from './modules/installation/installation.module'
import { PluginModule } from './modules/plugin/plugin.module'
import { LoggerModule } from 'nestjs-pino'
import { GdprModule } from './modules/gdpr/gdpr.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { AdminDiscountModule } from './modules/admin-discount/admin-discount.module'
import { WebhookModule } from './modules/webhook/webhook.module'
import { AdminMetaModule } from './modules/admin-meta/admin-meta.module'
import { AdminScriptTagModule } from './modules/admin-script-tag/admin-script-tag.module'
import { OrderModule } from './modules/order/order.module'
import { ProductModule } from './modules/product/product.module'
import paginate from 'mongoose-paginate'
import prettifier from 'pino-colada'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.APP_ENV}`,
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
          return connection
        }
      })
    }),
    UserModule,
    ShopifyModule,
    OfferModule,
    SubscriptionModule,
    InstallationModule,
    PluginModule,
    GdprModule,
    MonitorModule,
    AdminDiscountModule,
    WebhookModule,
    AdminMetaModule,
    AdminScriptTagModule,
    OrderModule,
    ProductModule
  ]
})
export class AppModule {}
