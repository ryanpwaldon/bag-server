export enum OfferType {
  MinimumSpend = 'minimumSpend',
  ProductAddOn = 'productAddOn',
  ProductUpgrade = 'productUpgrade'
}

export enum TriggerType {
  Product = 'product',
  Collection = 'collection',
  Tag = 'tag'
}

export interface Trigger {
  type: TriggerType
  id: string
}
