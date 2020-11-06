import { Controller, Post, Body, Get, Param, Put, Query, Delete, UseGuards } from '@nestjs/common'
import { CrossSellService } from './cross-sell.service'
import { RoleGuard } from '../../common/guards/role.guard'
import { Roles } from '../../common/decorators/role.decorator'
import { Role } from '../../common/constants/role.constants'
import { CreateCrossSellDto } from './dto/create-cross-sell.dto'
import { User } from 'src/common/decorators/user.decorator'
import { MongooseFilterQuery, PaginateResult, Schema } from 'mongoose'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { AdminProductService } from 'src/modules/admin-product/admin-product.service'

type CrossSellExtended = CrossSell & { product?: any }

@Controller('cross-sell')
export class CrossSellController {
  constructor(
    private readonly crossSellService: CrossSellService,
    private readonly adminProductService: AdminProductService
  ) {}

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
  @Roles(Role.Installed)
  async findOneById(@Param('id') id: string) {
    const item: CrossSellExtended | null = await this.crossSellService.findOneById(id)
    if (item?.productId) item.product = await this.adminProductService.findOneById(item.productId)
    return item
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
    const result: PaginateResult<CrossSellExtended> = await this.crossSellService.findAll(query, sort, page, limit)
    const products = await Promise.all(result.docs.map(item => this.adminProductService.findOneById(item.productId)))
    result.docs.forEach((item, i) => (item.product = products[i]))
    return result
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  deleteOneById(@Param('id') id: string) {
    return this.crossSellService.deleteOneById(id)
  }
}
