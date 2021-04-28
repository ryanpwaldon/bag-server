import moment from 'moment'
import readline from 'readline'
import { Injectable } from '@nestjs/common'
import { exchangeRates } from 'exchange-rates-api'
import { User } from 'src/modules/user/schema/user.schema'
import { MonthlySalesRecord } from '../user/schema/user.schema'
import { BulkOperationService } from 'src/modules/bulk-operation/bulk-operation.service'

@Injectable()
export class SalesService {
  constructor(private readonly bulkOperationService: BulkOperationService) {}

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
    const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100
    const stream = await this.bulkOperationService.performBulkOperation(user, query)
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
    const exchangeRate = (await exchangeRates()
      .at(endTime.toDate())
      .base(user.currencyCode)
      .symbols('USD')
      .fetch()) as number
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
