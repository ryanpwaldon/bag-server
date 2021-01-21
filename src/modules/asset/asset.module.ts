import { Module } from '@nestjs/common'
import { AssetService } from './asset.service'

@Module({
  providers: [AssetService]
})
export class AssetModule {}
