import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { OrderService } from 'src/modules/order/order.service'
import { Roles } from 'src/common/decorators/role.decorator'
import { Role } from 'src/common/constants/role.constants'
import { RoleGuard } from 'src/common/guards/role.guard'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('ids')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findByIds(@Query('ids') ids: string[] | undefined) {
    if (!ids?.length) return []
    return this.orderService.findByIds(ids)
  }
}
