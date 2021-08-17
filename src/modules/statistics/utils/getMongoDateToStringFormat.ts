export default (interval: string) => {
  if (interval === 'hour') return '%Y-%m-%dT%H:00:00%z'
  if (interval === 'day') return '%Y-%m-%dT00:00:00%z'
  if (interval === 'month') return '%Y-%m-01T00:00:00%z'
}
