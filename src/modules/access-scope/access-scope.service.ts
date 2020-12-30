import { Injectable } from '@nestjs/common'
import { AdminService } from 'src/modules/admin/admin.service'

@Injectable()
export class AccessScopeService {
  constructor(private readonly adminService: AdminService) {}

  async find() {
    const { data } = await this.adminService.createRequest({
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
