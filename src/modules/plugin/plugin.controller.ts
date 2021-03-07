import { Permission } from 'src/modules/user/user.types'
import { User } from 'src/common/decorators/user.decorator'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { User as UserType } from 'src/modules/user/schema/user.schema'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { CrossSellService } from 'src/modules/cross-sell/cross-sell.service'
import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common'
import { ProgressBar } from 'src/modules/progress-bar/schema/progress-bar.schema'
import { ProgressBarService } from 'src/modules/progress-bar/progress-bar.service'

interface Offers {
  crossSells: CrossSell[]
  progressBars: ProgressBar[]
}

@Controller('plugin')
export class PluginController {
  constructor(
    private readonly crossSellService: CrossSellService,
    private readonly progressBarService: ProgressBarService
  ) {}

  @Get('offers')
  @UseGuards(PluginGuard)
  async findSettings(@User() user: UserType): Promise<Offers> {
    if (!user) throw new BadRequestException()
    const query = { active: true, user: user.id }
    const options = { limit: Number.MAX_SAFE_INTEGER }
    const hasCrossSellPermission = user.permissions.includes(Permission.CrossSell)
    const hasProgressBarPermission = user.permissions.includes(Permission.ProgressBar)
    const [crossSells, progressBars] = await Promise.all([
      this.crossSellService.findAll(query, options),
      this.progressBarService.findAll(query, options)
    ])
    return {
      crossSells: hasCrossSellPermission ? crossSells.docs : [],
      progressBars: hasProgressBarPermission ? progressBars.docs : []
    }
  }
}
