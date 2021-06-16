import { Decimal } from 'decimal.js'
import moment from 'moment-timezone'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { UserService } from 'src/modules/user/user.service'
import { Payment } from 'src/modules/user/schema/user.schema'
import { AffiliateService } from 'src/modules/affiliate/affiliate.service'
import { AFFILIATE_COMMISSION, CRON_TIMEZONE } from 'src/common/constants'
import { TransactionService } from 'src/modules/transaction/transaction.service'
import { HoneybadgerService } from 'src/modules/honeybadger/honeybadger.service'

@Injectable()
export class TaskService {
  appId = process.env.APP_ID

  constructor(
    private readonly userService: UserService,
    private readonly affiliateService: AffiliateService,
    private readonly transactionService: TransactionService,
    private readonly honeybadgerService: HoneybadgerService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_5AM, { timeZone: CRON_TIMEZONE })
  async recordUserSubscriptionCharges() {
    const users = (await this.userService.findAll({}, 1, Number.MAX_SAFE_INTEGER)).docs
    const createdAtMax = moment().toISOString()
    const createdAtMin = moment(createdAtMax)
      .subtract(1, 'day')
      .toISOString()
    for (const user of users) {
      console.log('user')
      console.log(user.shopOrigin)
      try {
        const transactions = await this.transactionService.find(user.shopOrigin, createdAtMin, createdAtMax)
        console.log('transactions')
        console.log(transactions)
        if (transactions.length) {
          const payments: Payment[] = transactions.map((transaction: any) => ({
            chargeId: transaction.node.chargeId,
            createdAt: transaction.node.createdAt,
            netAmount: parseFloat(transaction.node.netAmount.amount),
            grossAmount: parseFloat(transaction.node.grossAmount.amount),
            billingInterval: transaction.node.billingInterval
          }))
          user.payments = [...user.payments, ...payments]
          console.log('payments')
          console.log(user.payments)
          user.save()
          if (user.affiliate) {
            const affiliate = await this.affiliateService.findById(user.affiliate)
            if (!affiliate) continue
            const startOfMonth = moment().utc().startOf('month') // prettier-ignore
            const endOfMonth = moment(startOfMonth).utc().add(1, 'month') // prettier-ignore
            const userTotalGrossPayments = payments.reduce((total, payment) => Decimal.add(total, payment.grossAmount).toNumber(), 0) // prettier-ignore
            const totalAffiliateCommission = Decimal.mul(userTotalGrossPayments, AFFILIATE_COMMISSION).toNumber()
            const payoutExists = affiliate.payouts[startOfMonth.toISOString()]
            if (payoutExists) {
              affiliate.payouts[startOfMonth.toISOString()].value = Decimal.add(affiliate.payouts[startOfMonth.toISOString()].value, totalAffiliateCommission).toNumber() // prettier-ignore
            } else {
              affiliate.payouts[startOfMonth.toISOString()] = {
                periodStart: startOfMonth.toDate(),
                periodEnd: endOfMonth.toDate(),
                value: totalAffiliateCommission
              }
            }
            affiliate.markModified('payouts')
            affiliate.save()
            console.log('affiliate payouts')
            console.log(affiliate.payouts)
          }
        }
      } catch (err) {
        this.honeybadgerService.notify(err)
        continue
      }
    }
  }
}
