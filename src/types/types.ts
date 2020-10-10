interface FindAllResponse<T> {
  items: T[]
  first: number
  last: number
  total: number
  pages: number
  page: number
}
