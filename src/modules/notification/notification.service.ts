import moment from 'moment'
import { uniqBy } from 'lodash'
import { Injectable } from '@nestjs/common'
import { CRON_TIMEZONE } from 'src/common/constants'
import { User } from 'src/modules/user/schema/user.schema'
import { Template } from 'src/modules/mail/types/template'
import formatCurrency from 'src/common/utils/formatCurrency'
import { Cron, CronExpression } from '@nestjs/schedule'
import { MailService, Persona } from 'src/modules/mail/mail.service'
import { Conversion } from 'src/modules/conversion/schema/conversion.schema'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { Notification } from 'src/modules/notification/notification.constants'

type ConversionWithPopulatedUser = Conversion & { user: User }

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailService, private readonly conversionService: ConversionService) {}

  @Cron(CronExpression.EVERY_DAY_AT_7AM, { timeZone: CRON_TIMEZONE })
  async sendDailyConversionReport() {
    const now = moment()
    const filter = { createdAt: { $gte: moment(now).subtract(24, 'hours'), $lte: now } }
    const conversions = (await this.conversionService.findAll(filter).populate('user')) as ConversionWithPopulatedUser[]
    const users = conversions.map(item => item.user)
    const uniqueUsers = uniqBy(users, 'id')
    for (const user of uniqueUsers) {
      if (user.unsubscribedNotifications?.includes(Notification.ConversionReportDaily)) continue
      const conversionsForUser = conversions.filter(conversion => conversion.user.id === user.id)
      const conversionRevenueAsDecimal = conversionsForUser.reduce(
        (total, conversion) => (total += conversion.value),
        0
      )
      const conversionRevenue = formatCurrency(conversionRevenueAsDecimal, user.currencyCode)
      const conversionCount = conversionsForUser.length
      const templateModel = {
        conversionCount,
        conversionRevenue,
        date: now.format('DD MMMM YYYY')
      }
      this.mailService.sendWithTemplate({
        to: user.email,
        from: Persona.Notifications,
        template: Template.ConversionReportDaily,
        templateModel
      })
    }
  }
}
