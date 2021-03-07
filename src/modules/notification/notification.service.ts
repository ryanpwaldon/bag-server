import { uniqBy } from 'lodash'
import moment from 'moment-timezone'
import { Cron } from '@nestjs/schedule'
import { CRON_TIMEZONE } from 'src/common/constants'
import { User } from 'src/modules/user/schema/user.schema'
import { Template } from 'src/modules/mail/types/template'
import { MailService, Persona } from 'src/modules/mail/mail.service'
import { CrossSell } from 'src/modules/cross-sell/schema/cross-sell.schema'
import { ConversionService } from 'src/modules/conversion/conversion.service'
import { Notification } from 'src/modules/notification/notification.constants'
import { ProgressBar } from 'src/modules/progress-bar/schema/progress-bar.schema'
import { Conversion, ConversionType } from 'src/modules/conversion/schema/conversion.schema'
import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'

type ConversionWithPopulatedUser = Conversion & { user: User }

interface FormattedConversion {
  type: string
  href: string
  title: string
}

interface Order {
  orderNumber: number
  conversions: FormattedConversion[]
}

type ConversionsForUserByOrder = Record<number, Order>

const formatConversion = (user: User, conversion: Conversion | ConversionWithPopulatedUser): FormattedConversion => {
  switch (conversion.type) {
    case ConversionType.CrossSell:
      return {
        type: 'Cross sell',
        href: `${user.appUrl}/offers/cross-sells/${(conversion.object as CrossSell).id}`,
        title: (conversion.object as CrossSell).title
      }
    case ConversionType.ProgressBar:
      return {
        type: 'Progress bar',
        href: `${user.appUrl}/offers/progress-bars/${(conversion.object as ProgressBar).id}`,
        title: (conversion.object as ProgressBar).title
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

  async sendConversionNotification(user: User, conversions: Conversion[], orderNumber: number) {
    if (!conversions.length) return
    if (user.unsubscribedNotifications?.includes(Notification.Conversion)) return
    conversions = await Promise.all(conversions.map(conversion => conversion.populate('object').execPopulate()))
    const now = moment()
    const conversionCount = conversions.length
    const formattedConversions = conversions.map(conversion => formatConversion(user, conversion))
    const templateModel = {
      orderNumber,
      conversionCount,
      plurality: conversionCount > 1,
      conversions: formattedConversions,
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
    const conversions = (await this.conversionService
      .findAll(filter)
      .populate('user')
      .populate('object')) as ConversionWithPopulatedUser[]
    const users = conversions.map(item => item.user)
    const uniqueUsers = uniqBy(users, 'id')
    for (const user of uniqueUsers) {
      if (user.unsubscribedNotifications?.includes(Notification.ConversionReportWeekly)) continue
      const conversionsForUser = conversions.filter(conversion => conversion.user.id === user.id)
      const ordersForUser = conversionsForUser.reduce((orders, conversion) => {
        if (conversion.order.order_number in orders) {
          orders[conversion.order.order_number].conversions.push(formatConversion(user, conversion))
        } else {
          orders[conversion.order.order_number] = {
            orderNumber: conversion.order.order_number,
            conversions: [formatConversion(user, conversion)]
          }
        }
        return orders
      }, {} as ConversionsForUserByOrder)
      const orders = Object.values(ordersForUser)
      const conversionCount = conversionsForUser.length
      const orderCount = orders.length
      const templateModel = {
        orders,
        orderCount,
        conversionCount,
        orderPlurality: orderCount > 1,
        conversionPlurality: conversionCount > 1,
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
