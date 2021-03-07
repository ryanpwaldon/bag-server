import { PluginGuard } from 'src/common/guards/plugin.guard'
import { DateRange } from 'src/modules/progress-bar/progress-bar.types'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { OrderCreatedService } from 'src/modules/event/modules/order-created/order-created.service'
import { CrossSellImpression } from 'src/modules/event/modules/cross-sell-impression/schema/cross-sell-impression.schema'
import { CrossSellImpressionService } from 'src/modules/event/modules/cross-sell-impression/cross-sell-impression.service'

@Controller('event')
export class EventController {
  constructor(
    private readonly orderCreatedService: OrderCreatedService,
    private readonly crossSellImpressionService: CrossSellImpressionService
  ) {}

  @Post('cross-sell-impression')
  @UseGuards(PluginGuard)
  async createCrossSellImpressionEvent(@Body() data: Partial<CrossSellImpression>) {
    this.crossSellImpressionService.create(data)
  }

  @Get('order-created/count-by-date-ranges')
  @UseGuards(EmbeddedAppGuard)
  async countOrderCreatedEventsByDateRanges(@Query('dateRanges') dateRanges: DateRange[]) {
    return this.orderCreatedService.countByDateRanges(dateRanges)
  }
}
