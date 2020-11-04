import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { AdminProductService } from './admin-product.service'

@Controller('admin-product')
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  @Get('one')
  @UseGuards(RoleGuard)
  @Roles(Role.Plugin)
  findOneById(@Query('id') id: string) {
    return this.adminProductService.findOneById(id)
  }
}
