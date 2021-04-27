import { FilterQuery, Types } from 'mongoose'
import { GetUser } from 'src/common/decorators/user.decorator'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { ProgressBar } from 'src/modules/progress-bar/schema/progress-bar.schema'
import { ProgressBarService } from 'src/modules/progress-bar/progress-bar.service'
import { EmbeddedAppOrPluginGuard } from 'src/common/guards/embedded-app-or-plugin.guard'
import { CreateProgressBarDto } from 'src/modules/progress-bar/dto/create-progress-bar.dto'
import { UpdateProgressBarDto } from 'src/modules/progress-bar/dto/update-progress-bar.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'

@Controller('progress-bar')
export class ProgressBarController {
  constructor(private readonly progressBarService: ProgressBarService) {}

  @Post()
  @UseGuards(EmbeddedAppGuard)
  create(@Body() createProgressBarDto: CreateProgressBarDto, @GetUser('id') userId: Types.ObjectId) {
    return this.progressBarService.create({ ...createProgressBarDto, user: userId })
  }

  @Put(':id')
  @UseGuards(EmbeddedAppGuard)
  update(@Param('id') id: string, @Body() updateProgressBarDto: UpdateProgressBarDto) {
    return this.progressBarService.updateOneById(id, updateProgressBarDto)
  }

  @Get(':id')
  @UseGuards(EmbeddedAppGuard)
  findOneById(@Param('id') id: string) {
    return this.progressBarService.findOneById(id)
  }

  @Get()
  @UseGuards(EmbeddedAppOrPluginGuard)
  async findAll(
    @GetUser('id') userId: Types.ObjectId,
    @Query('sort') sort: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('query') query: FilterQuery<ProgressBar> = {}
  ) {
    console.time('Progress bar query:')
    query.user = userId
    const options = { sort, page, limit }
    const progressBars = await this.progressBarService.findAll(query, options)
    console.timeEnd('Progress bar query:')
    return progressBars
  }

  @Delete(':id')
  @UseGuards(EmbeddedAppGuard)
  deleteOneById(@Param('id') id: string) {
    return this.progressBarService.deleteOneById(id)
  }
}
