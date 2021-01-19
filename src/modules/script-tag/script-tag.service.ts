import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class ScriptTagService {
  constructor(private readonly adminService: AdminService) {}

  async createOrUpdate(src: string) {
    const scriptTagId = await this.findScriptTag()
    if (scriptTagId) await this.update(scriptTagId, src)
    else await this.create(src)
  }

  async create(src: string) {
    await this.adminService.createRequest({
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

  async update(id: string, src: string) {
    await this.adminService.createRequest({
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

  async delete() {
    const scriptTagId = await this.findScriptTag()
    if (!scriptTagId) return
    await this.adminService.createRequest({
      query: /* GraphQL */ `
        mutation {
          scriptTagDelete(id: "${scriptTagId}") {
            deletedScriptTagId
          }
        }
      `
    })
  }

  async findScriptTag(): Promise<string | undefined> {
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
    return data.scriptTags.edges.length && data.scriptTags.edges[0].node.id
  }
}
