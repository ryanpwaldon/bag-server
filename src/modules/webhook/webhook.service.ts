import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class WebhookService {
  constructor(private readonly configService: ConfigService, private readonly adminService: AdminService) {}

  async create(topic: string, url: string) {
    const exists = await this.checkExistence(topic)
    if (exists) return
    url = `${this.configService.get('SERVER_URL')}${url}`
    this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
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
  }

  async checkExistence(topic: string) {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
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
