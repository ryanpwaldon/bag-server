import { LeanDocument } from 'mongoose'
import { UserService } from './user.service'
import { User } from 'src/common/decorators/user.decorator'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(EmbeddedAppGuard)
  async findById(@User('id') userId: string) {
    return this.userService.findById(userId)
  }

  @Put()
  @UseGuards(EmbeddedAppGuard)
  async updateOneById(@User('id') userId: string, @Body() body: LeanDocument<UserType>) {
    return this.userService.updateOneById(userId, body)
  }

  @Get('subscription')
  @UseGuards(PluginGuard)
  async findPlan(@User('subscription') subscription: string) {
    return subscription
  }
}
