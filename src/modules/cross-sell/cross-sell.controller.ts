import { FilterQuery, Types } from 'mongoose'
import { CrossSellService } from './cross-sell.service'
import { User } from 'src/modules/user/schema/user.schema'
import { GetUser } from 'src/common/decorators/user.decorator'
import { CreateCrossSellDto } from './dto/create-cross-sell.dto'
import { UpdateCrossSellDto } from './dto/update-cross-sell.dto'
import { ProductService } from 'src/modules/product/product.service'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { EmbeddedAppOrPluginGuard } from 'src/common/guards/embedded-app-or-plugin.guard'
import { Controller, Post, Body, Get, Param, Put, Query, Delete, UseGuards } from '@nestjs/common'

@Controller('cross-sell')
export class CrossSellController {
  constructor(private readonly crossSellService: CrossSellService, private readonly productService: ProductService) {}

  async populateProduct(user: User, item: CrossSell | null) {
    if (!item) return null
    const leanItem = item.toObject()
    leanItem.product = await this.productService.findOneById(user, leanItem.productId)
    return leanItem
  }

  async populateProducts(user: User, items: CrossSell[]) {
    if (!items.length) return items
    const leanItems = items.map(item => item.toObject())
    const products = await this.productService.findByIds(
      user,
      leanItems.map(leanItem => leanItem.productId)
    )
    for (const leanItem of leanItems)
      leanItem.product = products.find((product: any) => leanItem.productId === product?.id)
    return leanItems
  }

  @Post()
  @UseGuards(EmbeddedAppGuard)
  async create(@Body() createCrossSellDto: CreateCrossSellDto, @GetUser('id') userId: Types.ObjectId) {
    return this.crossSellService.create({ ...createCrossSellDto, user: userId })
  }

  @Put(':id')
  @UseGuards(EmbeddedAppGuard)
  async update(@GetUser() user: User, @Param('id') id: string, @Body() updateCrossSellDto: UpdateCrossSellDto) {
    const item = await this.crossSellService.updateOneById(id, updateCrossSellDto)
    return this.populateProduct(user, item)
  }

  @Get(':id')
  @UseGuards(EmbeddedAppGuard)
  async findOneById(@GetUser() user: User, @Param('id') id: string) {
    const item = await this.crossSellService.findOneById(id)
    return this.populateProduct(user, item)
  }

  @Get()
  @UseGuards(EmbeddedAppOrPluginGuard)
  async findAll(
    @GetUser() user: User,
    @Query('sort') sort: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('query') query: FilterQuery<CrossSell> = {},
    @Query('populateProducts') populateProducts = true
  ) {
    query.user = user.id
    const options = { sort, page, limit }
    const result = await this.crossSellService.findAll(query, options)
    if (!populateProducts) return result
    const docs = await this.populateProducts(user, result.docs)
    return { ...result, docs }
  }

  @Delete(':id')
  @UseGuards(EmbeddedAppGuard)
  deleteOneById(@Param('id') id: string) {
    return this.crossSellService.deleteOneById(id)
  }
}
