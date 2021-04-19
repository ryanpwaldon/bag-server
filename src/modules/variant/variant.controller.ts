import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { VariantService } from 'src/modules/variant/variant.service'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get('ids')
  @UseGuards(EmbeddedAppGuard)
  findByIds(@Query('ids') ids: string[] | undefined) {
    if (!ids?.length) return []
    return this.variantService.findByIds(ids)
  }
}
