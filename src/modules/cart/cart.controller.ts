import { CartService } from 'src/modules/cart/cart.service'
import { User } from 'src/common/decorators/user.decorator'
import { Cart } from 'src/modules/cart/schema/cart.schema'
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { EmbeddedAppOrPluginGuard } from 'src/common/guards/embedded-app-or-plugin.guard'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(EmbeddedAppOrPluginGuard)
  async findOneByUserId(@User('id') userId: string) {
    return this.cartService.findOneByUserId(userId)
  }

  @Put()
  @UseGuards(EmbeddedAppGuard)
  async updateOneByUserId(@User('id') userId: string, @Body() body: Partial<Cart>) {
    return this.cartService.updateOneByUserId(userId, body)
  }
}
