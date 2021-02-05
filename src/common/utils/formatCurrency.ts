const defaultLocale = 'en'
const defaultCurrency = 'USD'

export default (amount: number, currencyCode: string = defaultCurrency) => {
  return new Intl.NumberFormat(defaultLocale, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol'
  }).format(amount)
}
