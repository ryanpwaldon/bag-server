import { Controller, Post, Body, Get, Param, Put, Query, Delete, UseGuards } from '@nestjs/common'
import { CrossSellService } from './cross-sell.service'
import { RoleGuard } from '../../common/guards/role.guard'
import { Roles } from '../../common/decorators/role.decorator'
import { Role } from '../../common/constants/role.constants'
import { CreateCrossSellDto } from './dto/create-cross-sell.dto'
import { UserService } from 'src/modules/user/user.service'
import { User } from 'src/common/decorators/user.decorator'
import { MongooseFilterQuery, Schema } from 'mongoose'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'

@Controller('cross-sell')
export class CrossSellController {
  constructor(private readonly crossSellService: CrossSellService, private readonly userService: UserService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async create(@Body() createCrossSellDto: CreateCrossSellDto) {
    return this.crossSellService.create(createCrossSellDto)
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async update(@Param('id') id: string, @Body() createCrossSellDto: CreateCrossSellDto) {
    return this.crossSellService.updateOneById(id, createCrossSellDto)
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  findOneById(@Param('id') id: string) {
    return this.crossSellService.findOneById(id)
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed, Role.Plugin)
  async findAll(
    @User('id') userId: Schema.Types.ObjectId,
    @Query('sort') sort: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('query') query: MongooseFilterQuery<CrossSell> = {}
  ) {
    query.user = userId
    return this.crossSellService.findAll(query, sort, page, limit)
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  deleteOneById(@Param('id') id: string) {
    return this.crossSellService.deleteOneById(id)
  }
}
