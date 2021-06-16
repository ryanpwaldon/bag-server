import { Injectable } from '@nestjs/common'
import { PartnerService } from 'src/modules/partner/partner.service'

@Injectable()
export class TransactionService {
  appId = process.env.APP_ID

  constructor(private readonly partnerService: PartnerService) {}

  async find(shopOrigin: string, createdAtMin: string, createdAtMax: string) {
    return (
      await this.partnerService.request({
        query: /* GraphQL */ `
        {
          transactions (types: [APP_SUBSCRIPTION_SALE], appId: "${this.appId}", myshopifyDomain: "${shopOrigin}", createdAtMin: "${createdAtMin}", createdAtMax: ${createdAtMax}) {
            edges {
              node {
                ...on AppSubscriptionSale {
                  chargeId
                  createdAt
                  billingInterval
                  netAmount {
                    amount
                  }
                  grossAmount {
                    amount
                  }
                }
              }
            }
          }
        }
      `
      })
    ).data.transactions.edges
  }
}
