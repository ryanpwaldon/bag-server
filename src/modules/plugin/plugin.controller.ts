import { Controller, Body, Get, Put, UseGuards } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { UserService } from '../user/user.service'
import { RoleGuard } from '../../common/guards/role.guard'
import { User } from 'src/common/decorators/user.decorator'
import { Schema } from 'mongoose'
import { Plugin } from 'src/modules/plugin/schema/plugin.schema'

@Controller('plugin')
export class PluginController {
  constructor(private readonly pluginService: PluginService, private readonly userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Starter, Role.Plugin)
  findOneByUserId(@User('id') userId: Schema.Types.ObjectId) {
    return this.pluginService.findOne({ user: userId })
  }

  @Put()
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  updateOneByUserId(@User('id') userId: Schema.Types.ObjectId, @Body() body: Partial<Plugin>) {
    return this.pluginService.updateOne({ user: userId }, body)
  }
}
