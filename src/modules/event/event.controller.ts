import { RoleGuard } from 'src/common/guards/role.guard'
import { Role } from 'src/common/constants/role.constants'
import { Roles } from 'src/common/decorators/role.decorator'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CrossSellImpression } from 'src/modules/event/modules/cross-sell-impression/schema/cross-sell-impression.schema'
import { CrossSellImpressionService } from 'src/modules/event/modules/cross-sell-impression/cross-sell-impression.service'

@Controller('event')
export class EventController {
  constructor(private readonly crossSellImpressionService: CrossSellImpressionService) {}

  @Post('cross-sell-impression')
  @UseGuards(RoleGuard)
  @Roles(Role.Plugin)
  async create(@Body() data: Partial<CrossSellImpression>) {
    this.crossSellImpressionService.create(data)
  }
}
