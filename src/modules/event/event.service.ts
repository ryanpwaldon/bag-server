import { Event } from 'src/modules/event/schema/event.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Model, FilterQuery } from 'mongoose'

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>) {}

  count(query: FilterQuery<Event>) {
    return this.eventModel.countDocuments(query)
  }
}
