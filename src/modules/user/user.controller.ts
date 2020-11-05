import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { User } from 'src/common/decorators/user.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async findById(@User('id') userId: string) {
    return this.userService.findById(userId)
  }

  @Get('plan')
  @Roles(Role.Plugin)
  async findPlan(@User('id') userId: string) {
    const user = await this.userService.findById(userId)
    return user ? user.plan : null
  }
}
