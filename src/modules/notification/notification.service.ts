import moment from 'moment'
import { Injectable } from '@nestjs/common'
import { CRON_TIMEZONE } from 'src/common/constants'
import { MailService } from 'src/modules/mail/mail.service'
import { Cron, CronExpression, Timeout } from '@nestjs/schedule'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { ShopEmailService } from 'src/modules/shop-email/shop-email.service'

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailService: MailService,
    private readonly shopEmailService: ShopEmailService,
    private readonly conversionService: ConversionService
  ) {}

  // @Timeout(1000)
  async sendDailyConversionReport() {
    console.log('hallo')
    // const now = moment()
    // const filter = { createdAt: { $gte: moment(now).subtract(24, 'hours'), $lte: now } }
    // const conversions = await this.conversionService.findAll(filter)
    // const userIds = [...new Set(conversions.map(item => item.user.toString()))]
    // for (const userId of userIds) {
    //   const conversionsForUser = conversions.filter(item => item.user.toString() === userId)
    //   const conversionRevenue = conversionsForUser.reduce((total, item) => (total += item.value), 0)
    //   const conversionCount = conversionsForUser.length
    //   const shopEmail = await this.shopEmailService.find()
    //   console.log(shopEmail)
    // }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_7AM, { timeZone: CRON_TIMEZONE })
  sendWeeklyConversionReport() {
    console.log('hallo')
  }
}
