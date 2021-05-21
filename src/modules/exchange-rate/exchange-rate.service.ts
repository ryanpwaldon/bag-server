import moment from 'moment'
import { HttpService, Injectable } from '@nestjs/common'

@Injectable()
export class ExchangeRateService {
  baseUrl = 'http://data.fixer.io/api'

  constructor(private readonly httpService: HttpService) {}

  async getExchangeRate(userCurrencyCode: string, date: Date) {
    const baseCurrencyCode = 'EUR'
    const usdCurrencyCode = 'USD'
    const formattedDate = moment(date).format('YYYY-MM-DD')
    const url = `${this.baseUrl}/${formattedDate}?access_key=${process.env.FIXER_API_KEY}&base=${baseCurrencyCode}&symbols=${usdCurrencyCode},${userCurrencyCode}`
    const rates = (await this.httpService.request({ method: 'get', url }).toPromise()).data.rates
    const exchangeRate = rates[usdCurrencyCode] / rates[userCurrencyCode]
    return exchangeRate
  }
}
