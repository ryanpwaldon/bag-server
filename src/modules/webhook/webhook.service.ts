import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ShopifyService } from '../shopify/shopify.service'
import { Logger } from 'nestjs-pino'

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly shopifyService: ShopifyService,
    private readonly logger: Logger
  ) {}

  async create(topic, url) {
    const exists = await this.checkExistence(topic)
    if (exists) return
    url = `${this.configService.get('SERVER_URL')}${url}`
    this.shopifyService.createRequest({
      query: `
        mutation {
          webhookSubscriptionCreate (topic: ${topic}, webhookSubscription: {
            callbackUrl: "${url}",
            format: JSON
          }) {
            webhookSubscription {
              id
            }
          }
        }
      `
    })
    this.logger.log(`Webhook created: ${topic}`)
  }

  async checkExistence(topic) {
    const { data } = await this.shopifyService.createRequest({
      query: `
        {
          webhookSubscriptions (first: 1, topics: ${topic}) {
            edges {
              node {
                id
              }
            }
          }
        }
      `
    })
    if (data.webhookSubscriptions.edges.length) return true
    return false
  }
}
