import moment from 'moment'
import readline from 'readline'
import { Injectable } from '@nestjs/common'
import { User } from 'src/modules/user/schema/user.schema'
import { MonthlySalesRecord } from '../user/schema/user.schema'
import { ExchangeRateService } from 'src/modules/exchange-rate/exchange-rate.service'
import { BulkOperationService } from 'src/modules/bulk-operation/bulk-operation.service'

@Injectable()
export class SalesService {
  constructor(
    private readonly exhangeRateService: ExchangeRateService,
    private readonly bulkOperationService: BulkOperationService
  ) {}

  async fetchMonthlySalesRecord(user: User): Promise<MonthlySalesRecord> {
    const endTime = moment()
      .utc()
      .startOf('month')
    const startTime = moment(endTime).subtract(1, 'month')
    const query = /* GraphQL */ `
      {
        orders(
          sortKey: PROCESSED_AT
          reverse: true
          query: "created_at:>=${startTime.toISOString()} AND created_at:<${endTime.toISOString()}"
        ) {
          edges {
            node {
              netPaymentSet {
                shopMoney {
                  amount
                }
              }
            }
          }
        }
      }
    `
    const emptySalesRecord = {
      aov: 0,
      netSales: 0,
      orderCount: 0,
      startTime: startTime.toDate(),
      endTime: endTime.toDate()
    }
    let stream
    try {
      stream = await this.bulkOperationService.performBulkOperation(user, query)
    } catch (err) {
      console.log(err)
      console.log('An error occurred fetching sales data for store: ' + user.shopOrigin)
      return emptySalesRecord
    }
    // if no stream, return empty sales record -> store did not complete any sales for the given time period
    if (!stream) return emptySalesRecord
    const lines = readline.createInterface({ input: stream, crlfDelay: Infinity })
    let orderCount = 0
    let aovInShopCurrency = null
    let netSalesInShopCurrency = 0
    for await (const line of lines) {
      orderCount++
      const order = JSON.parse(line)
      netSalesInShopCurrency += parseFloat(order.netPaymentSet.shopMoney.amount)
    }
    aovInShopCurrency = netSalesInShopCurrency / orderCount
    const exchangeRate = await this.exhangeRateService.getExchangeRate(user.currencyCode, endTime.toDate())
    const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100
    const aovInUsd = roundToTwo(aovInShopCurrency * exchangeRate)
    const netSalesInUsd = roundToTwo(netSalesInShopCurrency * exchangeRate)
    return {
      orderCount,
      aov: aovInUsd,
      netSales: netSalesInUsd,
      startTime: startTime.toDate(),
      endTime: endTime.toDate()
    }
  }
}
