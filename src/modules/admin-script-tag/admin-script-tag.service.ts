import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'
import { Logger } from 'nestjs-pino'

@Injectable()
export class AdminScriptTagService {
  constructor(private readonly adminService: AdminService, private readonly logger: Logger) {}

  async create(src: string) {
    const exists = await this.checkExistence()
    if (exists) return
    this.adminService.createRequest({
      query: /* GraphQL */ `
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
    const { data } = await this.adminService.createRequest({
      query: /* GraphQL */ `
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
