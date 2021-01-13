import { User } from 'src/common/decorators/user.decorator'
import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { ConversionService } from 'src/modules/conversion/conversion.service'

@Controller('conversion')
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Get('cross-sell/:id')
  @UseGuards(EmbeddedAppGuard)
  async findByCrossSellId(@User('id') userId: string, @Param('id') id: string) {
    return this.conversionService.findByCrossSellId(userId, id)
  }
}
