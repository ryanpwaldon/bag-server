import moment from 'moment'
import { Injectable } from '@nestjs/common'
import { AdminService } from 'src/modules/admin/admin.service'

type ShopDetails = {
  email: string
  timezone: string
  currencyCode: string
  appUrl: string
}

export type OrderAnalysis = {
  periodInDays: number | null
  ordersForPeriod: number | null
  revenueForPeriod: number | null
  averageMonthlyRevenue: number | null
  averageMonthlyOrders: number | null
  averageOrderValue: number | null
}

@Injectable()
export class ShopDetailsService {
  constructor(private readonly adminService: AdminService) {}

  async find(): Promise<ShopDetails> {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
        {
          shop {
            email
            currencyCode
            ianaTimezone
          }
          appInstallation {
            launchUrl
          }
        }
      `
    })
    return {
      email: data.shop.email,
      timezone: data.shop.ianaTimezone,
      currencyCode: data.shop.currencyCode,
      appUrl: data.appInstallation.launchUrl
    }
  }

  async findOrderAnalysis() {
    const orderAnalysis: OrderAnalysis = {
      periodInDays: null,
      ordersForPeriod: null,
      revenueForPeriod: null,
      averageMonthlyRevenue: null,
      averageMonthlyOrders: null,
      averageOrderValue: null
    }
    try {
      const { data } = await this.adminService.createGraphQLRequest({
        query: /* GraphQL */ `
          {
            orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
              edges {
                node {
                  processedAt
                  totalPriceSet {
                    shopMoney {
                      amount
                    }
                  }
                }
              }
            }
          }
        `
      })
      const ordersForPeriod = data.orders.edges.length
      if (ordersForPeriod) {
        const revenueForPeriod = data.orders.edges.reduce(
          (total: number, order: any) => parseFloat(order.node.totalPriceSet.shopMoney.amount) + total,
          0
        )
        const mostRecentOrderDate = moment(data.orders.edges[0].node.processedAt)
        const leastRecentOrderDate = moment(data.orders.edges[data.orders.edges.length - 1].node.processedAt)
        const periodInDays = mostRecentOrderDate.diff(leastRecentOrderDate, 'days') || 1
        const averageMonthlyRevenue = ((revenueForPeriod / periodInDays) * 365.25) / 12
        const averageMonthlyOrders = ((ordersForPeriod / periodInDays) * 365.25) / 12
        const averageOrderValue = averageMonthlyRevenue / averageMonthlyOrders
        const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100
        orderAnalysis.periodInDays = periodInDays
        orderAnalysis.ordersForPeriod = ordersForPeriod
        orderAnalysis.revenueForPeriod = roundToTwo(revenueForPeriod)
        orderAnalysis.averageMonthlyRevenue = roundToTwo(averageMonthlyRevenue)
        orderAnalysis.averageMonthlyOrders = roundToTwo(averageMonthlyOrders)
        orderAnalysis.averageOrderValue = roundToTwo(averageOrderValue)
      }
    } catch (err) {
      console.log(err)
    }
    return orderAnalysis
  }
}
