import { Controller, Get, UseGuards } from '@nestjs/common'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { AppUrlService } from './app-url.service'

@Controller('app-url')
export class AppUrlController {
  constructor(private readonly appUrlService: AppUrlService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  find() {
    return this.appUrlService.find()
  }
}
