import { Controller, Post, Body, Get, Headers, Req, UseGuards, NotFoundException } from '@nestjs/common'
import { AdminSubscriptionService } from './admin-subscription.service'
import { UserService } from '../user/user.service'
import { Roles } from '../../common/decorators/role.decorator'
import { Role } from '../../common/constants/role.constants'
import { Logger } from 'nestjs-pino'
import { RoleGuard } from '../../common/guards/role.guard'
import { Request } from 'express'
import { User } from 'src/modules/user/schema/user.schema'

@Controller('admin-subscription')
export class AdminSubscriptionController {
  constructor(
    private readonly adminSubscriptionService: AdminSubscriptionService,
    private readonly userService: UserService,
    private readonly logger: Logger
  ) {}

  @Post('create')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  create(@Body('name') name: string) {
    return this.adminSubscriptionService.create(name)
  }

  @Get('sync')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  syncViaClient() {
    return this.adminSubscriptionService.sync()
  }

  @Post('sync')
  async syncViaWebhook(@Req() req: Request & { user: User }, @Headers('x-shopify-shop-domain') shopOrigin: string) {
    this.logger.log('Webhook triggered: APP_SUBSCRIPTIONS_UPDATE')
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) throw new NotFoundException()
    req.user = user
    return this.adminSubscriptionService.sync()
  }

  @Get('cancel')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  cancel() {
    return this.adminSubscriptionService.cancel()
  }

  @Get('plans')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findAllPlans() {
    return this.adminSubscriptionService.findAllPlans()
  }
}
