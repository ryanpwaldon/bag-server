import { Moment } from 'moment-timezone'
import { TimeUnit } from 'src/modules/statistics/statistics.controller'

export default (startDate: Moment, endDate: Moment, interval: TimeUnit) => {
  const dateIntervals = []
  const currentDate = startDate.clone()
  while (currentDate.isBefore(endDate)) {
    dateIntervals.push(currentDate.format('YYYY-MM-DDTHH:mm:SSZZ'))
    currentDate.add(1, interval)
  }
  return dateIntervals
}
