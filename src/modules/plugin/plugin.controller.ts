import { Permission } from 'src/modules/user/user.types'
import { User } from 'src/common/decorators/user.decorator'
import { CartService } from 'src/modules/cart/cart.service'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common'

@Controller('plugin')
export class PluginController {
  constructor(private readonly cartService: CartService) {}

  @Get('permissions')
  @UseGuards(PluginGuard)
  async findSettings(@User() user: UserType): Promise<Permission[]> {
    if (!user) throw new BadRequestException()
    return user.permissions
  }
}
