import { UserService } from './user.service'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { User } from 'src/common/decorators/user.decorator'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(EmbeddedAppGuard)
  async findById(@User('id') userId: string) {
    return this.userService.findById(userId)
  }

  @Get('subscription')
  @UseGuards(PluginGuard)
  async findPlan(@User('subscription') subscription: string) {
    return subscription
  }
}
