import { Controller, Get, UseGuards } from '@nestjs/common'
import { Roles } from '../../common/decorators/role.decorator'
import { Role } from '../../common/constants/role.constants'
import { User } from 'src/common/decorators/user.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { UserService } from '../user/user.service'
import { Schema } from 'mongoose'

@Controller('plugin')
export class PluginController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Plugin)
  findSettings(@User('id') userId: Schema.Types.ObjectId) {
    return userId
  }
}
