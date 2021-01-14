import { Permission } from 'src/modules/user/user.types'
import { User } from 'src/common/decorators/user.decorator'
import { CartService } from 'src/modules/cart/cart.service'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common'

type PluginSettings = {
  active: boolean
  permissions: Permission[]
}

@Controller('plugin')
export class PluginController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(PluginGuard)
  async findSettings(@User() user: UserType): Promise<PluginSettings> {
    if (!user) throw new BadRequestException()
    const cart = await this.cartService.findOneByUserId(user.id as string)
    if (!cart) throw new BadRequestException()
    return {
      active: cart.active,
      permissions: user.permissions
    }
  }
}
