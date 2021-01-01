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

  @Get('plan')
  @UseGuards(PluginGuard)
  async findPlan(@User('id') userId: string) {
    const user = await this.userService.findById(userId)
    return user ? user.plan : null
  }
}
