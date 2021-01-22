import { Injectable } from '@nestjs/common'
import { Asset } from 'src/modules/asset/asset.types'
import { AdminService } from 'src/modules/admin/admin.service'

@Injectable()
export class AssetService {
  constructor(private readonly adminService: AdminService) {}

  createOrUpdate(themeId: number, assetKey: string, assetValue: string) {
    const path = `themes/${themeId}/assets.json`
    const data = { asset: { key: assetKey, value: assetValue } }
    return this.adminService.createRestRequest('put', path, data)
  }

  async findOne(themeId: number, assetKey: string): Promise<Asset> {
    const path = `themes/${themeId}/assets.json?asset[key]=${assetKey}`
    return (await this.adminService.createRestRequest('get', path)).asset
  }
}
