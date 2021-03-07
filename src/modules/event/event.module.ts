import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { MongooseModule } from '@nestjs/mongoose'
import { EventController } from './event.controller'
import { UserModule } from 'src/modules/user/user.module'
import { Event, EventSchema } from './schema/event.schema'
import { OrderCreatedService } from 'src/modules/event/modules/order-created/order-created.service'
import { CrossSellImpressionService } from './modules/cross-sell-impression/cross-sell-impression.service'
import { OrderCreated, OrderCreatedSchema } from 'src/modules/event/modules/order-created/schema/order-created.schema'
import {
  CrossSellImpression,
  CrossSellImpressionSchema
} from './modules/cross-sell-impression/schema/cross-sell-impression.schema'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Event.name,
        useFactory: () => EventSchema,
        discriminators: [
          { name: CrossSellImpression.name, schema: CrossSellImpressionSchema },
          { name: OrderCreated.name, schema: OrderCreatedSchema }
        ]
      }
    ])
  ],
  controllers: [EventController],
  providers: [EventService, CrossSellImpressionService, OrderCreatedService],
  exports: [EventService, CrossSellImpressionService, OrderCreatedService]
})
export class EventModule {}
