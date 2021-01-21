import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class AppUrlService {
  constructor(private readonly adminService: AdminService) {}

  async find() {
    const { data } = await this.adminService.createGraphQLRequest({
      query: /* GraphQL */ `
        {
          appInstallation {
            launchUrl
          }
        }
      `
    })
    return data.appInstallation.launchUrl
  }
}
