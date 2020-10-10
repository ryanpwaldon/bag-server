import { Injectable } from '@nestjs/common'
import { ShopifyService } from '../shopify/shopify.service'

@Injectable()
export class MetaService {
  constructor(private readonly shopifyService: ShopifyService) {}

  async getAppUrl() {
    const { data } = await this.shopifyService.createRequest({
      query: `
        {
          appInstallation {
            launchUrl
          }
        }
      `
    })
    return data.appInstallation.launchUrl
  }
}
