import { OrderService } from 'src/modules/order/order.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { DateRange } from 'src/modules/progress-bar/progress-bar.types'
import { User } from 'src/common/decorators/user.decorator'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('count-by-date-ranges')
  @UseGuards(EmbeddedAppGuard)
  async countByDateRanges(@Query('dateRanges') dateRanges: DateRange[], @User('id') userId: string) {
    return this.orderService.countByDateRanges(dateRanges, userId)
  }
}
