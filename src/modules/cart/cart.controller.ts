import { LeanDocument } from 'mongoose'
import { User } from 'src/modules/user/schema/user.schema'
import { Cart } from 'src/modules/cart/schema/cart.schema'
import { CartService } from 'src/modules/cart/cart.service'
import { GetUser } from 'src/common/decorators/user.decorator'
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(EmbeddedAppGuard)
  async findOneByUserId(@GetUser('id') userId: string) {
    return this.cartService.findOneByUserId(userId)
  }

  @Put()
  @UseGuards(EmbeddedAppGuard)
  async updateOneByUserId(@GetUser() user: User, @Body() body: LeanDocument<Cart>) {
    return this.cartService.updateOneByUserId(user, body)
  }
}
