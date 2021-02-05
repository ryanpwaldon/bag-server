import { Injectable } from '@nestjs/common'
import { AdminService } from 'src/modules/admin/admin.service'

type ShopDetails = {
  email: string
  timezone: string
  currencyCode: string
  appUrl: string
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
            ianaTimezone
          }
          appInstallation {
            launchUrl
          }
        }
      `
    })
    return {
      email: data.shop.email,
      timezone: data.shop.ianaTimezone,
      currencyCode: data.shop.currencyCode,
      appUrl: data.appInstallation.launchUrl
    }
  }
}
