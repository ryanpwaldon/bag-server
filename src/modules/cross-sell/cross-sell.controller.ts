import { Controller, Post, Body, Get, Param, Put, Query, Delete, UseGuards } from '@nestjs/common'
import { CrossSellService } from './cross-sell.service'
import { RoleGuard } from '../../common/guards/role.guard'
import { Roles } from '../../common/decorators/role.decorator'
import { Role } from '../../common/constants/role.constants'
import { CreateCrossSellDto } from './dto/create-cross-sell.dto'
import { UpdateCrossSellDto } from './dto/update-cross-sell.dto'
import { User } from 'src/common/decorators/user.decorator'
import { FilterQuery, Types } from 'mongoose'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { ProductService } from 'src/modules/product/product.service'

type CrossSellExtended = Partial<CrossSell> & { product?: any }

@Controller('cross-sell')
export class CrossSellController {
  constructor(private readonly crossSellService: CrossSellService, private readonly productService: ProductService) {}

  async populate(item: CrossSell | null) {
    if (item === null) return null
    const result: CrossSellExtended = item.toObject()
    result.product = await this.productService.findOneById(item.productId)
    return result
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async create(@Body() createCrossSellDto: CreateCrossSellDto, @User('id') userId: Types.ObjectId) {
    return this.crossSellService.create({ ...createCrossSellDto, user: userId })
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async update(@Param('id') id: string, @Body() updateCrossSellDto: UpdateCrossSellDto) {
    const item = await this.crossSellService.updateOneById(id, updateCrossSellDto)
    return this.populate(item)
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async findOneById(@Param('id') id: string) {
    const item = await this.crossSellService.findOneById(id)
    return this.populate(item)
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed, Role.Plugin)
  async findAll(
    @User('id') userId: Types.ObjectId,
    @Query('sort') sort: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('query') query: FilterQuery<CrossSell> = {}
  ) {
    query.user = userId
    const result = await this.crossSellService.findAll(query, sort, page, limit)
    const docs = (await Promise.all(result.docs.map(item => this.populate(item)))) as CrossSellExtended[]
    return { ...result, docs }
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  deleteOneById(@Param('id') id: string) {
    return this.crossSellService.deleteOneById(id)
  }
}
