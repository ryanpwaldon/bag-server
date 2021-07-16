import { PluginGuard } from 'src/common/guards/plugin.guard'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CrossSellClick } from 'src/modules/event/modules/cross-sell-click/schema/cross-sell-click.schema'
import { CrossSellClickService } from 'src/modules/event/modules/cross-sell-click/cross-sell-click.service'

@Controller('event')
export class EventController {
  constructor(private readonly crossSellClickService: CrossSellClickService) {}

  @Post('cross-sell-click')
  @UseGuards(PluginGuard)
  async createCrossSellClickEvent(@Body() data: Partial<CrossSellClick>) {
    this.crossSellClickService.create(data)
  }
}
