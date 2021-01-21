import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class AdminDiscountService {
  constructor(private readonly adminService: AdminService) {}

  async findOne(id: string) {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
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
