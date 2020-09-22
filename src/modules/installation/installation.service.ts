import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ShopifyService } from '../shopify/shopify.service'
import { Logger } from 'nestjs-pino'

@Injectable()
export class InstallationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly shopifyService: ShopifyService,
    private readonly logger: Logger
  ) {}

  async findAppUrl() {
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

  async createScriptTag() {
    const { data } = await this.shopifyService.createRequest({
      query: `
        {
          scriptTags(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      `
    })
    if (data.scriptTags.edges.length) return
    const pluginUrl = this.configService.get('PLUGIN_URL')
    const scriptPath = this.configService.get('PLUGIN_SCRIPT_PATH')
    const scriptUrl = `${pluginUrl}/${scriptPath}`
    this.shopifyService.createRequest({
      query: `
        mutation {
          scriptTagCreate(input: {
            src: "${scriptUrl}"
          }) {
            scriptTag {
              id
              src
              displayScope
              updatedAt
              createdAt
            }
          }
        }
      `
    })
    this.logger.log(`Script tag created: ${scriptUrl}`)
  }

  async registerUninstallWebhook() {
    const topic = 'APP_UNINSTALLED'
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
    if (data.webhookSubscriptions.edges.length) return
    const callbackUrl = `${this.configService.get('SERVER_URL')}/installation/uninstall`
    this.shopifyService.createRequest({
      query: `
        mutation {
          webhookSubscriptionCreate (topic: ${topic}, webhookSubscription: {
            callbackUrl: "${callbackUrl}",
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
}
