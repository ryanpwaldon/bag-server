import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { AdminProductService } from './admin-product.service'
import { composeGid } from '@shopify/admin-graphql-api-utilities'

@Controller('admin-product')
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Plugin)
  findOneById(@Param('id') legacyId: string) {
    const id = composeGid('Product', legacyId)
    return this.adminProductService.findOneById(id)
  }
}
