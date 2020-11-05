import { Controller, Get, UseGuards } from '@nestjs/common'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { AdminMetaService } from './admin-meta.service'

@Controller('admin-meta')
export class AdminMetaController {
  constructor(private readonly adminMetaService: AdminMetaService) {}

  @Get('app-url')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findAppUrl() {
    return this.adminMetaService.findAppUrl()
  }
}
