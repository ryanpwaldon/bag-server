import { CreateCartEventDto } from 'src/modules/cart-event/dto/create-cart-event.dto'
import { CartEventService } from 'src/modules/cart-event/cart-event.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { Roles } from 'src/common/decorators/role.decorator'
import { Role } from 'src/common/constants/role.constants'
import { RoleGuard } from 'src/common/guards/role.guard'

@Controller('cart-event')
export class CartEventController {
  constructor(private readonly cartEventService: CartEventService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.Plugin)
  async create(@Body() createCartEventDto: CreateCartEventDto) {
    this.cartEventService.create(createCartEventDto)
  }
}
