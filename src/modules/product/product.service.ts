import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class ProductService {
  constructor(private readonly adminService: AdminService) {}

  async findOneById(id: string) {
    const { data } = await this.adminService.createGraphQLRequest({
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

  async findByIds(ids: string[]) {
    const { data } = await this.adminService.createGraphQLRequest({
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
