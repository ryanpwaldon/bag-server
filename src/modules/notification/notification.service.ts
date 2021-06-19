import { uniqBy } from 'lodash'
import moment from 'moment-timezone'
import { Cron } from '@nestjs/schedule'
import { CRON_TIMEZONE } from 'src/common/constants'
import { User } from 'src/modules/user/schema/user.schema'
import { Template } from 'src/modules/mail/types/template'
import { MailService, Persona } from 'src/modules/mail/mail.service'
import { Affiliate } from 'src/modules/affiliate/schema/affiliate.schema'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { Notification } from 'src/modules/notification/notification.constants'
import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConversionType, PopulatedConversion } from 'src/modules/conversion/schema/conversion.schema'

type OfferTemplatesById = Record<string, OfferTemplate>

interface OfferTemplate {
  type: string
  title: string
  offerId: string
  offerUrl: string
  conversionCount: number
  conversionPlurality: boolean
}

const getOfferTemplate = (conversion: PopulatedConversion): OfferTemplate => {
  const offerId = conversion.object.id as string
  switch (conversion.type) {
    case ConversionType.CrossSell:
      return {
        offerId,
        conversionCount: 0,
        type: 'Cross sell',
        conversionPlurality: true,
        title: conversion.object.title,
        offerUrl: `${conversion.user.appUrl}/offers/cross-sells/${offerId}`
      }
    case ConversionType.ProgressBar:
      return {
        offerId,
        conversionCount: 0,
        type: 'Progress bar',
        conversionPlurality: true,
        title: conversion.object.title,
        offerUrl: `${conversion.user.appUrl}/offers/progress-bars/${offerId}`
      }
    default:
      throw new InternalServerErrorException('Unknown conversion type.')
  }
}

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => ConversionService)) private readonly conversionService: ConversionService,
    private readonly mailService: MailService
  ) {}

  async sendConversionNotification(conversions: PopulatedConversion[], orderNumber: number) {
    const user = conversions[0].user
    if (!conversions.length) return
    if (user.unsubscribedNotifications?.includes(Notification.Conversion)) return
    const now = moment()
    const offerTemplates = conversions.map(conversion => getOfferTemplate(conversion))
    const templateModel = {
      orderNumber,
      appUrl: user.appUrl,
      offers: offerTemplates,
      conversionCount: conversions.length,
      conversionPlurality: conversions.length !== 1,
      date: now.tz(user.timezone).format('hh:MMa, DD MMMM YYYY')
    }
    this.mailService.sendWithTemplate({
      to: user.email,
      from: Persona.Notifications,
      template: Template.Conversion,
      templateModel
    })
  }

  @Cron('0 10 * * *', { timeZone: CRON_TIMEZONE })
  sendDailyConversionReport() {
    this.sendConversionReport(Notification.ConversionReportDaily, Template.ConversionReportDaily)
  }

  @Cron('10 10 * * MON', { timeZone: CRON_TIMEZONE })
  sendWeeklyConversionReport() {
    this.sendConversionReport(Notification.ConversionReportWeekly, Template.ConversionReportWeekly)
  }

  async sendConversionReport(notification: Notification, template: Template) {
    const now = moment()
    const daysToSubtract = notification === Notification.ConversionReportDaily ? 1 : 7
    const filter = { createdAt: { $gte: moment(now).subtract(daysToSubtract, 'days'), $lte: now } }
    const conversions = (await this.conversionService.findAll(filter)).filter(
      ({ object }) => !!object // filter out deleted offers
    ) as PopulatedConversion[]
    const users: User[] = conversions.map(item => item.user)
    const uniqueUsers = uniqBy(users, 'id')
    for (const user of uniqueUsers) {
      if (user.unsubscribedNotifications?.includes(notification)) continue
      const conversionsForUser = conversions.filter(conversion => conversion.user.id === user.id)
      const uniqueOrdersForUser = [...new Set(conversions.map(conversion => conversion.order.details.order_number))]
      const offersForUser = conversionsForUser.reduce((offers, conversion) => {
        const offerId = conversion.object.id as string
        if (!(offerId in offers)) offers[offerId] = getOfferTemplate(conversion)
        offers[offerId].conversionCount++
        return offers
      }, {} as OfferTemplatesById)
      const offerTemplates = Object.values(offersForUser).map(template => {
        template.conversionPlurality = template.conversionCount !== 1
        return template
      })
      const templateModel = {
        appUrl: user.appUrl,
        offers: offerTemplates,
        offerCount: offerTemplates.length,
        offerPlurality: offerTemplates.length !== 1,
        orderCount: uniqueOrdersForUser.length,
        orderPlurality: uniqueOrdersForUser.length !== 1,
        conversionCount: conversionsForUser.length,
        conversionPlurality: conversionsForUser.length !== 1,
        date: now.tz(user.timezone).format('DD MMMM YYYY')
      }
      this.mailService.sendWithTemplate({
        template,
        templateModel,
        to: user.email,
        from: Persona.Notifications
      })
    }
  }

  async sendAffiliateReferralNotification(affiliate: Affiliate, user: User) {
    if (affiliate.referralNotification) {
      const templateModel = {
        date: moment().format('DD MMMM YYYY'),
        referredUserUrl: user.primaryDomain,
        affiliateSiteUrl: process.env.AFFILIATE_URL
      }
      this.mailService.sendWithTemplate({
        templateModel,
        to: affiliate.email,
        from: Persona.Notifications,
        template: Template.AffiliateReferral
      })
    }
  }

  async sendAffiliateConversionNotification(affiliate: Affiliate, commission: string) {
    if (affiliate.conversionNotification) {
      const templateModel = {
        commission,
        date: moment().format('DD MMMM YYYY'),
        affiliateSiteUrl: process.env.AFFILIATE_URL
      }
      this.mailService.sendWithTemplate({
        templateModel,
        to: affiliate.email,
        from: Persona.Notifications,
        template: Template.AffiliateConversion
      })
    }
  }
}
