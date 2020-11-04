import { Injectable } from '@nestjs/common'
import { ShopifyService } from '../shopify/shopify.service'
import { Logger } from 'nestjs-pino'

@Injectable()
export class AdminScriptTagService {
  constructor(private readonly shopifyService: ShopifyService, private readonly logger: Logger) {}

  async create(src) {
    const exists = await this.checkExistence()
    if (exists) return
    this.shopifyService.createRequest({
      query: `
        mutation {
          scriptTagCreate(input: {
            src: "${src}"
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
    this.logger.log(`Script tag created: ${src}`)
  }

  async checkExistence() {
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
    if (data.scriptTags.edges.length) return true
    return false
  }
}
