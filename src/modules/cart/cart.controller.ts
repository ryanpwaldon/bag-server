import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { Roles } from 'src/common/decorators/role.decorator'
import { CartService } from 'src/modules/cart/cart.service'
import { Role } from 'src/common/constants/role.constants'
import { User } from 'src/common/decorators/user.decorator'
import { Cart } from 'src/modules/cart/schema/cart.schema'
import { RoleGuard } from 'src/common/guards/role.guard'
import { Schema } from 'mongoose'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async findOneByUserId(@User('id') id: Schema.Types.ObjectId) {
    return this.cartService.findOneByUserId(id)
  }

  @Put()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async updateOneByUserId(@User('id') id: Schema.Types.ObjectId, @Body() body: Partial<Cart>) {
    return this.cartService.updateOneByUserId(id, body)
  }
}
