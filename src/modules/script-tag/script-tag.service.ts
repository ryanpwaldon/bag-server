import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'

export enum DisplayScope {
  ALL = 'ALL',
  ONLINE_STORE = 'ONLINE_STORE',
  ORDER_STATUS = 'ORDER_STATUS'
}

@Injectable()
export class ScriptTagService {
  constructor(private readonly adminService: AdminService) {}

  async create(src: string, displayScope: DisplayScope) {
    const exists = await this.checkExistence()
    if (exists) return
    this.adminService.createRequest({
      query: /* GraphQL */ `
        mutation {
          scriptTagCreate(input: {
            src: "${src}",
            displayScope: ${displayScope}
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
