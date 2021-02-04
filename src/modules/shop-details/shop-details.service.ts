import { Injectable } from '@nestjs/common'
import { AdminService } from 'src/modules/admin/admin.service'

type ShopDetails = {
  email: string
  currencyCode: string
}

@Injectable()
export class ShopDetailsService {
  constructor(private readonly adminService: AdminService) {}

  async find(): Promise<ShopDetails> {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
        {
          shop {
            email
            currencyCode
          }
        }
      `
    })
    return {
      email: data.shop.email,
      currencyCode: data.shop.currencyCode
    }
  }
}
