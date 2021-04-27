import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'
import { User } from 'src/modules/user/schema/user.schema'

@Injectable()
export class ProductService {
  constructor(private readonly adminService: AdminService) {}

  async findOneById(user: User, id: string) {
    const { data } = await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        {
          product(id: "${id}") {
            id
            title
            handle
            featuredImage {
              originalSrc
            }
            hasOnlyDefaultVariant
            variants(first: 100) {
              edges {
                node {
                  legacyResourceId
                  title
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

  async findByIds(user: User, ids: string[]) {
    const { data } = await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        {
          nodes(ids: ${JSON.stringify(ids)}) {
            ...on Product {
              id
              title
              handle
              featuredImage {
                originalSrc
              }
              hasOnlyDefaultVariant
              variants(first: 100) {
                edges {
                  node {
                    legacyResourceId
                    title
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
        }
      `
    })
    return data.nodes
  }
}
