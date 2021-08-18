import { Types } from 'mongoose'
import moment from 'moment-timezone'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/common/decorators/user.decorator'
import getInterval from 'src/modules/statistics/utils/getInterval'
import getDateIntervals from 'src/modules/statistics/utils/getDateIntervals'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { ConversionType } from 'src/modules/conversion/schema/conversion.schema'
import getMongoDateToStringFormat from 'src/modules/statistics/utils/getMongoDateToStringFormat'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { CrossSellService } from 'src/modules/cross-sell/cross-sell.service'
import { User } from 'src/modules/user/schema/user.schema'
import { ProgressBarService } from 'src/modules/progress-bar/progress-bar.service'

export type TimeUnit = 'hour' | 'day' | 'month' | 'year'

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly conversionService: ConversionService,
    private readonly crossSellService: CrossSellService,
    private readonly progressBarService: ProgressBarService
  ) {}

  // prettier-ignore
  @Get('chart')
  @UseGuards(EmbeddedAppGuard)
  async getChartData(
    @Query('date') date: string,
    @GetUser('id') userId: string,
    @Query('period') period: TimeUnit,
    @Query('offerId') offerId: string,
    @Query('timezone') timezone: string,
    @Query('periodLength') periodLength: number,
    @Query('conversionType') conversionType: ConversionType
  ) {
    const startDate = moment.tz(date, timezone).startOf(period).subtract(periodLength - 1, period)
    const endDate = moment(startDate).add(periodLength, period)
    const interval = getInterval(startDate, endDate)
    const aggregation = await this.conversionService.aggregate([
      {
        $match: {
          type: conversionType,
          user: Types.ObjectId(userId),
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
          ...(offerId ? { object: Types.ObjectId(offerId) } : {})
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              date: '$createdAt',
              format: getMongoDateToStringFormat(interval),
              timezone: timezone
            }
          },
          totalConversions: { $sum: 1 },
          totalRevenue: { $sum: '$value' }
        }
      }
    ])
    const dateIntervals = getDateIntervals(startDate, endDate, interval)
    const conversionsPlot = new Array(dateIntervals.length).fill(0)
    const revenuePlot = new Array(dateIntervals.length).fill(0)
    for (const item of aggregation) {
      const insertionIndex = dateIntervals.indexOf(item._id)
      conversionsPlot[insertionIndex] = item.totalConversions
      revenuePlot[insertionIndex] = item.totalRevenue
    }
    const plots = []
    plots.push({ label: 'Conversions', data: conversionsPlot })
    if (conversionType === ConversionType.CrossSell) plots.push({ label: 'Revenue', data: revenuePlot, format: 'currency' })
    const metrics = []
    const totalConversions = conversionsPlot.reduce((total, value) => value += total, 0)
    const totalRevenue = revenuePlot.reduce((total, value) => value += total, 0)
    metrics.push({ label: 'Total Conversions', value: totalConversions })
    if (conversionType === ConversionType.CrossSell) metrics.push({ label: 'Total Revenue', value: totalRevenue, format: 'currency' })
    return {
      plots,
      metrics,
      interval,
      labels: dateIntervals
    }
  }

  // prettier-ignore
  @Get('top-conversions')
  @UseGuards(EmbeddedAppGuard)
  async getTopConversions(
    @GetUser() user: User,
    @Query('date') date: string,
    @Query('period') period: TimeUnit,
    @Query('offerId') offerId: string,
    @Query('timezone') timezone: string,
    @Query('periodLength') periodLength: number,
    @Query('conversionType') conversionType: ConversionType
  ) {
    const startDate = moment.tz(date, timezone).startOf(period).subtract(periodLength - 1, period)
    const endDate = moment(startDate).add(periodLength, period)
    const aggregation = await this.conversionService.aggregate([
      {
        $match: {
          type: conversionType,
          user: Types.ObjectId(user.id),
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
          ...(offerId ? { object: Types.ObjectId(offerId) } : {})
        }
      },
      {
        $group: {
          _id: '$object',
          conversionCount: { $sum: 1 },
          conversionRevenue: { $sum: '$value' }
        }
      }
    ])
    const items = []
    const ids = aggregation.map(({ _id }) => _id.toString())
    if (conversionType === ConversionType.CrossSell) {
      const crossSells = await this.crossSellService.findByIds(ids)
      for (const crossSell of crossSells) {
        const itemIndex = ids.indexOf(crossSell.id)
        items.push({
          convertedItem: {
            id: crossSell.id,
            title: `${crossSell.title} · ${crossSell.subtitle}`,
            path: `/offers/cross-sells/${crossSell.id}`
          },
          conversionCount: aggregation[itemIndex].conversionCount,
          conversionRevenue: aggregation[itemIndex].conversionRevenue,
        })
      }
    }
    if (conversionType === ConversionType.ProgressBar) {
      const progressBars = await this.progressBarService.findByIds(ids)
      for (const progressBar of progressBars) {
        const itemIndex = ids.indexOf(progressBar.id)
        items.push({
          convertedItem: {
            id: progressBar.id,
            title: `${progressBar.title} · ${progressBar.goal}`,
            path: `/offers/progress-bars/${progressBar.id}`
          },
          conversionCount: aggregation[itemIndex].conversionCount,
          conversionRevenue: aggregation[itemIndex].conversionRevenue,
        })
      }
    }
    return {
      conversionType,
      items: items.sort((a, b) => b.conversionCount - a.conversionCount)
    }
  }
}
