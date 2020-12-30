import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { Roles } from '../../common/decorators/role.decorator'
import { SubscriptionService } from './subscription.service'
import { Role } from '../../common/constants/role.constants'
import { RoleGuard } from '../../common/guards/role.guard'

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  create(@Body('name') name: string) {
    return this.subscriptionService.create(name)
  }

  @Get('sync')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  sync() {
    return this.subscriptionService.sync()
  }

  @Get('cancel')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  cancel() {
    return this.subscriptionService.cancel()
  }

  @Get('plans')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findAllPlans() {
    return this.subscriptionService.findAllPlans()
  }
}
