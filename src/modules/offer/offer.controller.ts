import { Controller, Post, Body, Get, Param, Put, Query, Delete, UseGuards, ParseIntPipe } from '@nestjs/common'
import { OfferService } from './offer.service'
import { RoleGuard } from '../../common/guards/role.guard'
import { Roles } from '../../common/decorators/role.decorator'
import { Role } from '../../common/constants/role.constants'
import { CreateOfferDto } from './dto/create-offer.dto'

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async create(@Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto)
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  findAll(@Query(new ParseIntPipe()) { query, page, limit }) {
    return this.offerService.findAll(query, page, limit)
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  findOneById(@Param('id') id) {
    return this.offerService.findOneById(id)
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  updateOneById(@Param('id') id, @Body() body) {
    return this.offerService.updateOneById(id, body)
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  deleteOneById(@Param('id') id) {
    return this.offerService.deleteOneById(id)
  }
}
