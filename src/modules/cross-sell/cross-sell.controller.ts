import { FilterQuery, Types } from 'mongoose'
import { CrossSellService } from './cross-sell.service'
import { User } from 'src/common/decorators/user.decorator'
import { CreateCrossSellDto } from './dto/create-cross-sell.dto'
import { UpdateCrossSellDto } from './dto/update-cross-sell.dto'
import { ProductService } from 'src/modules/product/product.service'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { Controller, Post, Body, Get, Param, Put, Query, Delete, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { EmbeddedAppOrPluginGuard } from 'src/common/guards/embedded-app-or-plugin.guard'

@Controller('cross-sell')
export class CrossSellController {
  constructor(private readonly crossSellService: CrossSellService, private readonly productService: ProductService) {}

  async populateProduct(item: CrossSell | null) {
    if (!item) return null
    const leanItem = item.toObject()
    leanItem.product = await this.productService.findOneById(leanItem.productId)
    return leanItem
  }

  async populateProducts(items: CrossSell[]) {
    if (!items.length) return items
    const leanItems = items.map(item => item.toObject())
    const products = await this.productService.findByIds(leanItems.map(leanItem => leanItem.productId))
    for (const leanItem of leanItems)
      leanItem.product = products.find((product: any) => leanItem.productId === product.id)
    return leanItems
  }

  @Post()
  @UseGuards(EmbeddedAppGuard)
  async create(@Body() createCrossSellDto: CreateCrossSellDto, @User('id') userId: Types.ObjectId) {
    return this.crossSellService.create({ ...createCrossSellDto, user: userId })
  }

  @Put(':id')
  @UseGuards(EmbeddedAppGuard)
  async update(@Param('id') id: string, @Body() updateCrossSellDto: UpdateCrossSellDto) {
    const item = await this.crossSellService.updateOneById(id, updateCrossSellDto)
    return this.populateProduct(item)
  }

  @Get(':id')
  @UseGuards(EmbeddedAppGuard)
  async findOneById(@Param('id') id: string) {
    const item = await this.crossSellService.findOneById(id)
    return this.populateProduct(item)
  }

  @Get()
  @UseGuards(EmbeddedAppOrPluginGuard)
  async findAll(
    @User('id') userId: Types.ObjectId,
    @Query('sort') sort: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('query') query: FilterQuery<CrossSell> = {},
    @Query('populateProducts') populateProducts = true
  ) {
    query.user = userId
    const options = { sort, page, limit }
    const result = await this.crossSellService.findAll(query, options)
    if (!populateProducts) return result
    const docs = await this.populateProducts(result.docs)
    return { ...result, docs }
  }

  @Delete(':id')
  @UseGuards(EmbeddedAppGuard)
  deleteOneById(@Param('id') id: string) {
    return this.crossSellService.deleteOneById(id)
  }
}
