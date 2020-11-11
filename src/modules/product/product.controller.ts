import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { ProductService } from './product.service'
import { composeGid } from '@shopify/admin-graphql-api-utilities'

@Controller('admin-product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Plugin)
  findOneById(@Param('id') legacyId: string) {
    const id = composeGid('Product', legacyId)
    return this.productService.findOneById(id)
  }
}
