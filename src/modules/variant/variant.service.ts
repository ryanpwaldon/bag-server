import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class VariantService {
  constructor(private readonly adminService: AdminService) {}

  async findByIds(ids: string[]) {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
        {
          nodes(ids: ${JSON.stringify(ids)}) {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              image {
                originalSrc
              }
              product {
                title
                featuredImage {
                  originalSrc
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
