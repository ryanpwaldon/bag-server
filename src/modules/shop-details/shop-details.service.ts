import { Injectable } from '@nestjs/common'
import { User } from 'src/modules/user/schema/user.schema'
import { AdminService } from 'src/modules/admin/admin.service'

type ShopDetails = {
  email: string
  appUrl: string
  timezone: string
  storeName: string
  shopifyPlan: string
  shopifyPlus: boolean
  currencyCode: string
  primaryDomain: string
  developmentStore: boolean
}

@Injectable()
export class ShopDetailsService {
  constructor(private readonly adminService: AdminService) {}

  async find(user: User): Promise<ShopDetails> {
    const { data } = await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        {
          shop {
            name
            email
            currencyCode
            ianaTimezone
            plan {
              displayName
              partnerDevelopment
              shopifyPlus
            }
            primaryDomain {
              url
            }
          }
          appInstallation {
            launchUrl
          }
        }
      `
    })
    return {
      email: data.shop.email,
      storeName: data.shop.name,
      timezone: data.shop.ianaTimezone,
      currencyCode: data.shop.currencyCode,
      shopifyPlan: data.shop.plan.displayName,
      developmentStore: data.shop.plan.partnerDevelopment,
      shopifyPlus: data.shop.plan.shopifyPlus,
      primaryDomain: data.shop.primaryDomain.url,
      appUrl: data.appInstallation.launchUrl
    }
  }
}
