import { Injectable } from '@nestjs/common'
import { AdminService } from 'src/modules/admin/admin.service'

@Injectable()
export class ShopEmailService {
  constructor(private readonly adminService: AdminService) {}

  async find() {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
        {
          shop {
            email
          }
        }
      `
    })
    return data.shop.email
  }
}
