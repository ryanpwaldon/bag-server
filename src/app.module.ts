import prettifier from 'pino-colada'
import { Module } from '@nestjs/common'
import paginate from 'mongoose-paginate'
import { LoggerModule } from 'nestjs-pino'
import autopopulate from 'mongoose-autopopulate'
import { MongooseModule } from '@nestjs/mongoose'
import { CartModule } from './modules/cart/cart.module'
import { GdprModule } from './modules/gdpr/gdpr.module'
import { LeadModule } from './modules/lead/lead.module'
import { MailModule } from './modules/mail/mail.module'
import { UserModule } from './modules/user/user.module'
import { AdminModule } from './modules/admin/admin.module'
import { EventModule } from './modules/event/event.module'
import { OrderModule } from './modules/order/order.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppUrlModule } from './modules/app-url/app-url.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { ProductModule } from './modules/product/product.module'
import { WebhookModule } from './modules/webhook/webhook.module'
import { CrossSellModule } from './modules/cross-sell/cross-sell.module'
import { ScriptTagModule } from './modules/script-tag/script-tag.module'
import { ConversionModule } from './modules/conversion/conversion.module'
import { InstallationModule } from './modules/installation/installation.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { AdminDiscountModule } from './modules/admin-discount/admin-discount.module'

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
          connection.plugin(autopopulate)
          return connection
        }
      })
    }),
    UserModule,
    AdminModule,
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
    EventModule,
    OrderModule,
    CartModule,
    LeadModule,
    MailModule,
    ConversionModule
  ]
})
export class AppModule {}
