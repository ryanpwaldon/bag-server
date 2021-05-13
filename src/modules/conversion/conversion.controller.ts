import { GetUser } from 'src/common/decorators/user.decorator'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { ConversionType } from 'src/modules/conversion/schema/conversion.schema'

@Controller('conversion')
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Get(':conversionType/:offerId')
  @UseGuards(EmbeddedAppGuard)
  async findByOffer(
    @Param('offerId') offerId: string,
    @Param('conversionType') conversionType: ConversionType,
    @GetUser('id') userId: string,
    @Query('page') page: number,
    @Query('sort') sort: string,
    @Query('limit') limit: number
  ) {
    const options = { sort, page, limit }
    return this.conversionService.findByOffer(userId, offerId, conversionType, options)
  }
}
