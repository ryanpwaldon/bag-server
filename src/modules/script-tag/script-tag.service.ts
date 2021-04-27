import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'
import { User } from 'src/modules/user/schema/user.schema'

@Injectable()
export class ScriptTagService {
  constructor(private readonly adminService: AdminService) {}

  async createOrUpdate(user: User, src: string) {
    const scriptTagId = await this.findScriptTag(user)
    if (scriptTagId) await this.update(user, scriptTagId, src)
    else await this.create(user, src)
  }

  async create(user: User, src: string) {
    await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        mutation {
          scriptTagCreate(input: {
            src: "${src}"
          }) {
            scriptTag {
              id
            }
          }
        }
      `
    })
  }

  async update(user: User, id: string, src: string) {
    await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        mutation {
          scriptTagUpdate(
            id: "${id}",
            input: { src: "${src}" }
          ) {
            scriptTag {
              id
            }
          }
        }
      `
    })
  }

  async delete(user: User) {
    const scriptTagId = await this.findScriptTag(user)
    if (!scriptTagId) return
    await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        mutation {
          scriptTagDelete(id: "${scriptTagId}") {
            deletedScriptTagId
          }
        }
      `
    })
  }

  async findScriptTag(user: User): Promise<string | undefined> {
    const { data } = await this.adminService.createGraphQLRequest(user, {
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
    return data.scriptTags.edges.length && data.scriptTags.edges[0].node.id
  }
}
