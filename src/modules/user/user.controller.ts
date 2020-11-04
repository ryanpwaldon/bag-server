import { Controller, Get, Headers, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'
import { User } from 'src/common/decorators/user.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async findMe(@User('id') userId: string) {
    return this.userService.findById(userId)
  }

  @Get('plan')
  async findPlan(@Headers('shop-origin') shopOrigin: string) {
    const user = await this.userService.findOne({ shopOrigin })
    return user ? user.plan : null
  }
}
