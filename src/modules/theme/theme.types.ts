export type Theme = {
  id: number
  name: string
  created_at: Date
  updated_at: Date
  role: 'main' | 'unpublished' | 'demo'
  theme_store_id?: number
  previewable: boolean
  processing: boolean
  admin_graphql_api_id: string
}
