import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from './modules/user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { AdminModule } from './modules/admin/admin.module'
import { OfferModule } from './modules/offer/offer.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { InstallationModule } from './modules/installation/installation.module'
import { LoggerModule } from 'nestjs-pino'
import { GdprModule } from './modules/gdpr/gdpr.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { AdminDiscountModule } from './modules/admin-discount/admin-discount.module'
import { WebhookModule } from './modules/webhook/webhook.module'
import { AppUrlModule } from './modules/app-url/app-url.module'
import { ScriptTagModule } from './modules/script-tag/script-tag.module'
import { ProductModule } from './modules/product/product.module'
import { CrossSellModule } from './modules/cross-sell/cross-sell.module'
import { CartEventModule } from './modules/cart-event/cart-event.module'
import { OrderModule } from './modules/order/order.module'
import { CartModule } from './modules/cart/cart.module'
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
    AdminModule,
    OfferModule,
    SubscriptionModule,
    InstallationModule,
    GdprModule,
    MonitorModule,
    AdminDiscountModule,
    WebhookModule,
    AppUrlModule,
    ScriptTagModule,
    ProductModule,
    CrossSellModule,
    CartEventModule,
    OrderModule,
    CartModule
  ]
})
export class AppModule {}
