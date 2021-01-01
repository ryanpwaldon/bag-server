import { User } from 'src/common/decorators/user.decorator'
import { SubscriptionService } from './subscription.service'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'

@Controller('subscription')
@UseGuards(EmbeddedAppGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  create(@User() user: UserType, @Body('subscriptionName') subscriptionName: string) {
    return this.subscriptionService.create(user, subscriptionName)
  }

  @Get('sync')
  sync(@User() user: UserType) {
    return this.subscriptionService.sync(user)
  }

  @Get('cancel')
  async cancel(@User() user: UserType) {
    await this.subscriptionService.cancel()
    await this.subscriptionService.sync(user)
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll()
  }
}
