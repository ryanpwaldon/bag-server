import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventService } from './event.service'
import { UserModule } from 'src/modules/user/user.module'
import { EventController } from './event.controller'
import { Event, EventSchema } from './schema/event.schema'
import { CrossSellImpressionService } from './modules/cross-sell-impression/cross-sell-impression.service'
import { ProgressBarImpressionService } from './modules/progress-bar-impression/progress-bar-impression.service'
import {
  CrossSellImpression,
  CrossSellImpressionSchema
} from './modules/cross-sell-impression/schema/cross-sell-impression.schema'
import {
  ProgressBarImpression,
  ProgressBarImpressionSchema
} from './modules/progress-bar-impression/schema/progress-bar-impression.schema'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Event.name,
        useFactory: () => EventSchema,
        discriminators: [
          { name: CrossSellImpression.name, schema: CrossSellImpressionSchema },
          { name: ProgressBarImpression.name, schema: ProgressBarImpressionSchema }
        ]
      }
    ])
  ],
  controllers: [EventController],
  providers: [EventService, CrossSellImpressionService, ProgressBarImpressionService],
  exports: [EventService, CrossSellImpressionService, ProgressBarImpressionService]
})
export class EventModule {}
