import { uniqBy } from 'lodash'
import moment from 'moment-timezone'
import { Cron } from '@nestjs/schedule'
import { LeanDocument } from 'mongoose'
import { CRON_TIMEZONE } from 'src/common/constants'
import { User } from 'src/modules/user/schema/user.schema'
import { Template } from 'src/modules/mail/types/template'
import formatCurrency from 'src/common/utils/formatCurrency'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { MailService, Persona } from 'src/modules/mail/mail.service'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { Notification } from 'src/modules/notification/notification.constants'
import { Conversion, ConversionType } from 'src/modules/conversion/schema/conversion.schema'

type ConversionWithPopulatedUser = Conversion & { user: User }

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => ConversionService)) private readonly conversionService: ConversionService,
    private readonly mailService: MailService
  ) {}

  async sendConversionNotification(user: User, conversions: LeanDocument<Conversion>[]) {
    if (!conversions.length) return
    if (user.unsubscribedNotifications?.includes(Notification.Conversion)) return
    const now = moment()
    const conversionRevenueAsDecimal = conversions.reduce((total, conversion) => (total += conversion.value), 0)
    const conversionRevenueFormatted = formatCurrency(conversionRevenueAsDecimal, user.currencyCode)
    const conversionCount = conversions.length
    const conversionLinks = conversions.map(conversion => {
      const link = { href: null as string | null, displayText: null as string | null }
      if (conversion.type === ConversionType.CrossSell) {
        link.href = `${user.appUrl}/offers/cross-sells/${conversion.object}`
        link.displayText = `/offers/cross-sells/${conversion.object}`
      }
      return link
    })
    const templateModel = {
      conversionCount,
      links: conversionLinks,
      conversionRevenue: conversionRevenueFormatted,
      date: now.tz(user.timezone).format('hh:MMa, DD MMMM YYYY')
    }
    this.mailService.sendWithTemplate({
      to: user.email,
      from: Persona.Notifications,
      template: Template.Conversion,
      templateModel
    })
  }

  @Cron('0 10 * * MON', { timeZone: CRON_TIMEZONE })
  async sendWeeklyConversionReport() {
    const now = moment()
    const filter = { createdAt: { $gte: moment(now).subtract(7, 'days'), $lte: now } }
    const conversions = (await this.conversionService.findAll(filter).populate('user')) as ConversionWithPopulatedUser[]
    const users = conversions.map(item => item.user)
    const uniqueUsers = uniqBy(users, 'id')
    for (const user of uniqueUsers) {
      if (user.unsubscribedNotifications?.includes(Notification.ConversionReportWeekly)) continue
      const conversionsForUser = conversions.filter(conversion => conversion.user.id === user.id)
      const conversionRevenueNumber = conversionsForUser.reduce((total, conversion) => (total += conversion.value), 0)
      const conversionRevenueFormatted = formatCurrency(conversionRevenueNumber, user.currencyCode)
      const conversionCount = conversionsForUser.length
      const templateModel = {
        conversionCount,
        conversionRevenue: conversionRevenueFormatted,
        date: now.tz(user.timezone).format('DD MMMM YYYY')
      }
      this.mailService.sendWithTemplate({
        to: user.email,
        from: Persona.Notifications,
        template: Template.ConversionReportWeekly,
        templateModel
      })
    }
  }
}
