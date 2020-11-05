import { Injectable } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class AdminMetaService {
  constructor(private readonly adminService: AdminService) {}

  async getAppUrl() {
    const { data } = await this.adminService.createRequest({
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
