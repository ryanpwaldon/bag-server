import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  Delete,
  InternalServerErrorException,
  Headers,
  Req,
  UseGuards
} from '@nestjs/common'
import { DiscountService } from './discount.service'
import { Roles } from '../../common/decorators/role.decorator'
import { Role } from '../../common/constants/role.constants'
import { User } from '../../common/decorators/user.decorator'
import { UserService } from '../user/user.service'
import { RoleGuard } from '../../common/guards/role.guard'

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService, private readonly userService: UserService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  async createViaShopifyLegacyResourceId(@Body() { shopifyLegacyResourceId }) {
    const shopifyId = await this.discountService.convertToShopifyId(shopifyLegacyResourceId)
    if (!shopifyId) throw new InternalServerErrorException('Failed to convert shopify legacy resource id.')
    return this.discountService.findOneOrCreate({ shopifyId })
  }

  @Get()
  async findAll(
    @Req() req,
    @Query() { filters = {} as any, page = 1, itemsPerPage = 20 },
    @Headers('shop-origin') shopOrigin
  ) {
    const user = await this.userService.findOne({ shopOrigin })
    req.user = user
    filters.user = user.id
    itemsPerPage = Number.MAX_SAFE_INTEGER
    return this.discountService.findAll(filters, page, itemsPerPage)
  }

  @Get('my')
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  findAllMy(@User() user, @Query() { filters = {} as any, page = 1, itemsPerPage = 20 }) {
    filters['user'] = user.id
    return this.discountService.findAll(filters, page, itemsPerPage)
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  findOneById(@Param('id') id) {
    return this.discountService.findOneById(id)
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  updateOneById(@Param('id') id, @Body() body) {
    return this.discountService.updateOneById(id, body)
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Starter)
  deleteOneById(@Param('id') id) {
    return this.discountService.deleteOneById(id)
  }
}
