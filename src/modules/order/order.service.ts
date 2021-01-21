import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class OrderService {
  constructor(private readonly adminService: AdminService) {}

  async findByIds(ids: string[]) {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
        {
          nodes(ids: ${JSON.stringify(ids)}) {
            ...on Order {
              id
              name
              processedAt
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems (first: 100) {
                edges {
                  node {
                    product {
                      id
                    }
                    discountedTotalSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
    return data.nodes
  }
}
