export interface Order {
  id: number
  email: string
  closed_at: null
  created_at: Date
  updated_at: Date
  number: number
  note: null
  token: string
  gateway: string
  test: boolean
  total_price: string
  subtotal_price: string
  total_weight: number
  total_tax: string
  taxes_included: boolean
  currency: Currency
  financial_status: string
  confirmed: boolean
  total_discounts: string
  total_line_items_price: string
  cart_token: string
  buyer_accepts_marketing: boolean
  name: string
  referring_site: string
  landing_site: string
  cancelled_at: null
  cancel_reason: null
  total_price_usd: string
  checkout_token: string
  reference: null
  user_id: null
  location_id: null
  source_identifier: null
  source_url: null
  processed_at: Date
  device_id: null
  phone: null
  customer_locale: string
  app_id: number
  browser_ip: string
  landing_site_ref: null
  order_number: number
  discount_applications: any[]
  discount_codes: any[]
  note_attributes: any[]
  payment_gateway_names: string[]
  processing_method: string
  checkout_id: number
  source_name: string
  fulfillment_status: null
  tax_lines: TaxLine[]
  tags: string
  contact_email: string
  order_status_url: string
  presentment_currency: Currency
  total_line_items_price_set: Set
  total_discounts_set: Set
  total_shipping_price_set: Set
  subtotal_price_set: Set
  total_price_set: Set
  total_tax_set: Set
  line_items: LineItem[]
  fulfillments: any[]
  refunds: any[]
  total_tip_received: string
  original_total_duties_set: null
  current_total_duties_set: null
  admin_graphql_api_id: string
  shipping_lines: ShippingLine[]
  billing_address: Address
  shipping_address: Address
  client_details: ClientDetails
  payment_details: PaymentDetails
  customer: Customer
}

export interface Address {
  first_name: string
  address1: string
  phone: null
  city: string
  zip: string
  province: string
  country: string
  last_name: string
  address2: string
  company: null
  latitude?: number
  longitude?: number
  name: string
  country_code: string
  province_code: string
  id?: number
  customer_id?: number
  country_name?: string
  default?: boolean
}

export interface ClientDetails {
  browser_ip: string
  accept_language: string
  user_agent: string
  session_hash: string
  browser_width: number
  browser_height: number
}

export enum Currency {
  Aud = 'AUD'
}

export interface Customer {
  id: number
  email: string
  accepts_marketing: boolean
  created_at: Date
  updated_at: Date
  first_name: string
  last_name: string
  orders_count: number
  state: string
  total_spent: string
  last_order_id: null
  note: null
  verified_email: boolean
  multipass_identifier: null
  tax_exempt: boolean
  phone: null
  tags: string
  last_order_name: null
  currency: Currency
  accepts_marketing_updated_at: Date
  marketing_opt_in_level: null
  admin_graphql_api_id: string
  default_address: Address
}

export interface LineItem {
  id: number
  variant_id: number
  title: string
  quantity: number
  sku: string
  variant_title: string
  vendor: string
  fulfillment_service: string
  product_id: number
  requires_shipping: boolean
  taxable: boolean
  gift_card: boolean
  name: string
  variant_inventory_management: null
  properties: any[]
  product_exists: boolean
  fulfillable_quantity: number
  grams: number
  price: string
  total_discount: string
  fulfillment_status: null
  price_set: null[]
  total_discount_set: null[]
  discount_allocations: any[]
  duties: any[]
  admin_graphql_api_id: string
  tax_lines: null[]
  origin_location: null[]
}

export interface PaymentDetails {
  credit_card_bin: string
  avs_result_code: null
  cvv_result_code: null
  credit_card_number: string
  credit_card_company: string
}

export interface ShippingLine {
  id: number
  title: string
  price: string
  code: string
  source: string
  phone: null
  requested_fulfillment_service_id: null
  delivery_category: null
  carrier_identifier: null
  discounted_price: string
  price_set: null[]
  discounted_price_set: null[]
  discount_allocations: any[]
  tax_lines: any[]
}

export interface Set {
  shop_money: Money
  presentment_money: Money
}

export interface Money {
  amount: string
  currency_code: Currency
}

export interface TaxLine {
  price: string
  rate: number
  title: string
  price_set: null[]
}
