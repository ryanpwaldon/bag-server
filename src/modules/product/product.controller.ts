import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('one')
  @UseGuards(RoleGuard)
  @Roles(Role.Plugin)
  findOneById(@Query('id') id) {
    return this.productService.findOneById(id)
  }
}
