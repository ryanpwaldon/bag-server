import { Controller, Get, Req, Headers, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { RoleGuard } from '../../common/guards/role.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async findMe(@Req() req) {
    const userId = req.user.id
    const user = await this.userService.findById(userId)
    return this.userService.attachDetails(user)
  }

  @Get('plan')
  async findPlan(@Headers('shop-origin') shopOrigin) {
    const user = await this.userService.findOne({ shopOrigin })
    return user.plan
  }
}
