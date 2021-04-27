import { Injectable } from '@nestjs/common'
import { User } from 'src/modules/user/schema/user.schema'
import { AdminService } from 'src/modules/admin/admin.service'

@Injectable()
export class AccessScopeService {
  constructor(private readonly adminService: AdminService) {}

  async find(user: User) {
    const { data } = await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        {
          appInstallation {
            accessScopes {
              handle
            }
          }
        }
      `
    })
    return data.appInstallation.accessScopes.map((accessScope: any) => accessScope.handle)
  }
}
