import { Controller, Get, UseGuards } from '@nestjs/common'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { MetaService } from './meta.service'

@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get('app-url')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findAppUrl() {
    return this.metaService.getAppUrl()
  }
}
