import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { MongooseModule } from '@nestjs/mongoose'
import { EventController } from './event.controller'
import { UserModule } from 'src/modules/user/user.module'
import { Event, EventSchema } from './schema/event.schema'
import { CrossSellClickService } from './modules/cross-sell-click/cross-sell-click.service'
import { CrossSellClick, CrossSellClickSchema } from './modules/cross-sell-click/schema/cross-sell-click.schema'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Event.name,
        useFactory: () => EventSchema,
        discriminators: [{ name: CrossSellClick.name, schema: CrossSellClickSchema }]
      }
    ])
  ],
  controllers: [EventController],
  providers: [EventService, CrossSellClickService],
  exports: [EventService, CrossSellClickService]
})
export class EventModule {}
