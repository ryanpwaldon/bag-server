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

export type TimeUnit = 'hour' | 'day' | 'month' | 'year'

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly conversionService: ConversionService) {}

  // prettier-ignore
  @Get('chart')
  @UseGuards(EmbeddedAppGuard)
  async getChartData(
    @Query('date') date: string,
    @GetUser('id') userId: string,
    @Query('period') period: TimeUnit,
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
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
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
    @Query('date') date: string,
    @GetUser('id') userId: string,
    @Query('period') period: TimeUnit,
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
          user: Types.ObjectId(userId),
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
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
    for (const item of aggregation) {
      items.push({
        convertedItem: item._id,
        conversionCount: item.conversionCount,
        conversionRevenue: item.conversionRevenue,
      })
    }
    return {
      conversionType,
      items: items.sort((a, b) => b.conversionCount - a.conversionCount)
    }
  }
}
