import { Controller, Post, Body, Get, Param, Put, Query, Delete, UseGuards } from '@nestjs/common'
import { OfferService } from './offer.service'
import { RoleGuard } from '../../common/guards/role.guard'
import { Roles } from '../../common/decorators/role.decorator'
import { Role } from '../../common/constants/role.constants'
import { CreateOfferDto } from './dto/create-offer.dto'
import { UserService } from 'src/modules/user/user.service'
import { User } from 'src/common/decorators/user.decorator'
import { MongooseFilterQuery } from 'mongoose'
import { Offer } from 'src/modules/offer/schema/offer.schema'

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService, private readonly userService: UserService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async create(@Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto)
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async update(@Param('id') id, @Body() createOfferDto: CreateOfferDto) {
    return this.offerService.updateOneById(id, createOfferDto)
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  findOneById(@Param('id') id) {
    return this.offerService.findOneById(id)
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed, Role.Plugin)
  async findAll(
    @User() user,
    @Query('sort') sort: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('query') query: MongooseFilterQuery<Offer> = {}
  ) {
    query.user = user.id
    return this.offerService.findAll(query, sort, page, limit)
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  deleteOneById(@Param('id') id) {
    return this.offerService.deleteOneById(id)
  }
}
