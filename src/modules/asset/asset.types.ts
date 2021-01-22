export type Asset = {
  key: string
  public_url?: string
  created_at: Date
  updated_at: Date
  content_type: string
  size: number
  checksum?: string
  theme_id: number
  value: string
}
