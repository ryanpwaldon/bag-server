import moment, { Moment } from 'moment-timezone'
import { TimeUnit } from 'src/modules/statistics/statistics.controller'

export default (startDate: Moment, endDate: Moment): TimeUnit => {
  const duration = moment.duration(endDate.diff(startDate))
  if (duration.asDays() <= 1) return 'hour'
  if (duration.asDays() <= 35) return 'day'
  return 'month'
}
