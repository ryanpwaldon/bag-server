import { OrderService } from 'src/modules/order/order.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('ids')
  @UseGuards(EmbeddedAppGuard)
  findByIds(@Query('ids') ids: string[] | undefined) {
    if (!ids?.length) return []
    return this.orderService.findByIds(ids)
  }
}
