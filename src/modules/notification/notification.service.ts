import moment from 'moment'
import { Injectable } from '@nestjs/common'
import { CRON_TIMEZONE } from 'src/common/constants'
import { MailService, Persona } from 'src/modules/mail/mail.service'
import { Cron, CronExpression, Timeout } from '@nestjs/schedule'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { User } from 'src/modules/user/schema/user.schema'
import { uniqBy } from 'lodash'
import { Conversion } from 'src/modules/conversion/schema/conversion.schema'
import { Template } from 'src/modules/mail/types/template'

type ConversionWithPopulatedUser = Conversion & { user: User }

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailService, private readonly conversionService: ConversionService) {}

  // @Cron(CronExpression.EVERY_DAY_AT_7AM, { timeZone: CRON_TIMEZONE })
  // @Timeout(1000)
  async sendDailyConversionReport() {
    const now = moment()
    const filter = { createdAt: { $gte: moment(now).subtract(48, 'hours'), $lte: now } }
    const conversions = (await this.conversionService.findAll(filter).populate('user')) as ConversionWithPopulatedUser[]
    const users = conversions.map(item => item.user)
    const uniqueUsers = uniqBy(users, 'id')
    for (const user of uniqueUsers) {
      const conversionsForUser = conversions.filter(conversion => conversion.user.id === user.id)
      const conversionRevenue = conversionsForUser.reduce((total, conversion) => (total += conversion.value), 0)
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
