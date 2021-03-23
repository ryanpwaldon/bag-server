import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { MongooseModule } from '@nestjs/mongoose'
import { EventController } from './event.controller'
import { UserModule } from 'src/modules/user/user.module'
import { Event, EventSchema } from './schema/event.schema'
import { CrossSellImpressionService } from './modules/cross-sell-impression/cross-sell-impression.service'
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
        discriminators: [{ name: CrossSellImpression.name, schema: CrossSellImpressionSchema }]
      }
    ])
  ],
  controllers: [EventController],
  providers: [EventService, CrossSellImpressionService],
  exports: [EventService, CrossSellImpressionService]
})
export class EventModule {}
