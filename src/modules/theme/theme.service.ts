import { Theme } from './theme.types'
import { Injectable } from '@nestjs/common'
import { AdminService } from 'src/modules/admin/admin.service'

@Injectable()
export class ThemeService {
  constructor(private readonly adminService: AdminService) {}

  async findMain(): Promise<Theme> {
    const themes: Theme[] = (await this.adminService.createRestRequest('get', 'themes.json')).themes
    return themes.find(theme => theme.role === 'main') as Theme
  }

  async findAll(): Promise<Theme[]> {
    return (await this.adminService.createRestRequest('get', 'themes.json')).themes
  }
}
