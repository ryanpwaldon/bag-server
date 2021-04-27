import { Theme } from './theme.types'
import { Injectable } from '@nestjs/common'
import { User } from 'src/modules/user/schema/user.schema'
import { AdminService } from 'src/modules/admin/admin.service'

@Injectable()
export class ThemeService {
  constructor(private readonly adminService: AdminService) {}

  async findMain(user: User): Promise<Theme> {
    const themes: Theme[] = (await this.adminService.createRestRequest(user, 'get', 'themes.json')).themes
    return themes.find(theme => theme.role === 'main') as Theme
  }

  async findAll(user: User): Promise<Theme[]> {
    return (await this.adminService.createRestRequest(user, 'get', 'themes.json')).themes
  }
}
