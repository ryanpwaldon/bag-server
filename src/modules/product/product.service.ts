import { Injectable } from '@nestjs/common'
import { ShopifyService } from '../shopify/shopify.service'
import { Product } from './product.types'

@Injectable()
export class ProductService {
  constructor(private readonly shopifyService: ShopifyService) {}

  async findOneById(id): Promise<Product> {
    const { data } = await this.shopifyService.createRequest({
      query: `
        {
          product(id: "${id}") {
            title
            featuredImage {
              originalSrc
            }
            hasOnlyDefaultVariant
            variants(first: 100) {
              edges {
                node {
                  legacyResourceId
                  displayName
                  image {
                    originalSrc
                    transformedSrc
                  }
                  price
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      `
    })
    return data.product
  }
}
