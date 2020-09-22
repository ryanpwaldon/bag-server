import {
  Controller,
  Body,
  Get,
  Put,
  Req,
  Headers,
  BadRequestException,
  NotFoundException,
  UseGuards
} from '@nestjs/common'
import { PluginService } from './plugin.service'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { UserService } from '../user/user.service'
import { RoleGuard } from '../../common/guards/role.guard'

@Controller('plugin')
export class PluginController {
  constructor(private readonly pluginService: PluginService, private readonly userService: UserService) {}

  @Get()
  async findOneByShopOrigin(@Headers('shop-origin') shopOrigin) {
    if (!shopOrigin) throw new BadRequestException(`Missing 'shop-origin' header.`)
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) throw new NotFoundException()
    return this.pluginService.findOne({ user: user.id })
  }

  @Get('my')
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  findMy() {
    return this.pluginService.findMyOrCreate()
  }

  @Put()
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  updateMy(@Req() req, @Body() body) {
    return this.pluginService.updateMy(req.user.id, body)
  }
}
