import { Injectable } from '@nestjs/common'
import { ShopifyService } from '../shopify/shopify.service'

@Injectable()
export class ProductService {
  constructor(private readonly shopifyService: ShopifyService) {}

  async findOneById(id) {
    const { data } = await this.shopifyService.createRequest({
      query: `
        {
          product(id: "${id}") {
            title
            featuredImage {
              originalSrc
            }
          }
        }
      `
    })
    return data.product
  }
}
