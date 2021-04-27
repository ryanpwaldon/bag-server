import { User } from 'src/modules/user/schema/user.schema'
import { GetUser } from 'src/common/decorators/user.decorator'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { VariantService } from 'src/modules/variant/variant.service'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get('ids')
  @UseGuards(EmbeddedAppGuard)
  findByIds(@GetUser() user: User, @Query('ids') ids: string[] | undefined) {
    if (!ids?.length) return []
    return this.variantService.findByIds(user, ids)
  }
}
