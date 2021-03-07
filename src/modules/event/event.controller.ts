import { FilterQuery } from 'mongoose'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { Event } from 'src/modules/event/schema/event.schema'
import { EventService } from 'src/modules/event/event.service'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common'
import { CrossSellImpression } from 'src/modules/event/modules/cross-sell-impression/schema/cross-sell-impression.schema'
import { CrossSellImpressionService } from 'src/modules/event/modules/cross-sell-impression/cross-sell-impression.service'
import { ProgressBarImpression } from 'src/modules/event/modules/progress-bar-impression/schema/progress-bar-impression.schema'
import { ProgressBarImpressionService } from 'src/modules/event/modules/progress-bar-impression/progress-bar-impression.service'

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly crossSellImpressionService: CrossSellImpressionService,
    private readonly progressBarImpressionService: ProgressBarImpressionService
  ) {}

  @Get('count')
  @UseGuards(EmbeddedAppGuard)
  count(@Query('query') query: FilterQuery<Event> = {}) {
    return this.eventService.count(query)
  }

  @Post('cross-sell-impression')
  @UseGuards(PluginGuard)
  async createCrossSellImpression(@Body() data: Partial<CrossSellImpression>) {
    this.crossSellImpressionService.create(data)
  }

  @Post('progress-bar-impression')
  @UseGuards(PluginGuard)
  async createProgressBarImpression(@Body() data: Partial<ProgressBarImpression>) {
    this.progressBarImpressionService.create(data)
  }
}
