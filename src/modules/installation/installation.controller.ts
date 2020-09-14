import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { InstallationService } from './installation.service'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { Logger } from 'nestjs-pino'
import { RoleGuard } from '../../common/guards/role.guard'

@Controller('installation')
export class InstallationController {
  constructor(
    private readonly userService: UserService,
    private readonly installationService: InstallationService,
    private readonly logger: Logger
  ) {}

  @Get('url')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findAppUrl() {
    return this.installationService.findAppUrl()
  }

  @Post('uninstall')
  async uninstall(@Body() body) {
    this.logger.log('Webhook triggered: APP_UNINSTALLED')
    const shopOrigin = body.myshopify_domain
    const user = await this.userService.findOne({ shopOrigin })
    user.uninstalled = true
    user.onboarded = false
    return user.save()
  }
}
