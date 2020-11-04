import { Injectable } from '@nestjs/common'
import { ShopifyService } from '../shopify/shopify.service'

@Injectable()
export class AdminDiscountService {
  constructor(private readonly shopifyService: ShopifyService) {}

  async findOne(id) {
    const { data } = await this.shopifyService.createRequest({
      query: `
        {
          codeDiscountNode(id: "${id}") {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                shortSummary
                startsAt
                status
                summary
                title
                usageLimit
              }
              ... on DiscountCodeBxgy {
                startsAt
                status
                summary
                title
                usageLimit
              }
              ... on DiscountCodeFreeShipping {
                shortSummary
                startsAt
                status
                summary
                title
                usageLimit
              }
            }
          }
        }
      `
    })
    return data.codeDiscountNode
  }
}
