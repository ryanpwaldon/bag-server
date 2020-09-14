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
import { WidgetService } from './widget.service'
import { Role } from '../../common/constants/role.constants'
import { Roles } from '../../common/decorators/role.decorator'
import { UserService } from '../user/user.service'
import { RoleGuard } from '../../common/guards/role.guard'

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService, private readonly userService: UserService) {}

  @Get()
  async findOneByShopOrigin(@Headers('shop-origin') shopOrigin) {
    if (!shopOrigin) throw new BadRequestException(`Missing 'shop-origin' header.`)
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) throw new NotFoundException()
    return this.widgetService.findOne({ user: user.id })
  }

  @Get('my')
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  findMy() {
    return this.widgetService.findMyOrCreate()
  }

  @Put()
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  updateMy(@Req() req, @Body() body) {
    return this.widgetService.updateMy(req.user.id, body)
  }
}
