import { LeanDocument } from 'mongoose'
import { UserService } from './user.service'
import { User } from 'src/modules/user/schema/user.schema'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { GetUser } from 'src/common/decorators/user.decorator'
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(EmbeddedAppGuard)
  async findMe(@GetUser('id') userId: string) {
    return this.userService.findById(userId)
  }

  @Put()
  @UseGuards(EmbeddedAppGuard)
  async updateOneById(@GetUser('id') userId: string, @Body() body: LeanDocument<User>) {
    return this.userService.updateOneById(userId, body)
  }

  @Get('subscription')
  @UseGuards(PluginGuard)
  async findPlan(@GetUser('subscription') subscription: string) {
    return subscription
  }
}
