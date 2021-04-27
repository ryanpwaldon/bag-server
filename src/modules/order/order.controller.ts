import { OrderService } from 'src/modules/order/order.service'
import { GetUser } from 'src/common/decorators/user.decorator'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { DateRange } from 'src/modules/progress-bar/progress-bar.types'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('count-by-date-ranges')
  @UseGuards(EmbeddedAppGuard)
  async countByDateRanges(@GetUser('id') userId: string, @Query('dateRanges') dateRanges: DateRange[]) {
    return this.orderService.countByDateRanges(userId, dateRanges)
  }
}
