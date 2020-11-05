import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'
import { Product } from './admin-product.types'

@Injectable()
export class AdminProductService {
  constructor(private readonly adminService: AdminService) {}

  async findOneById(id: string): Promise<Product> {
    const { data } = await this.adminService.createRequest({
      query: /* GraphQL */ `
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
}
