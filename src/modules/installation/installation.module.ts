import { Module } from '@nestjs/common'
import { InstallationService } from './installation.service'
import { InstallationController } from './installation.controller'
import { ShopifyModule } from '../shopify/shopify.module'
import { UserModule } from '../user/user.module'

@Module({
  providers: [InstallationService],
  controllers: [InstallationController],
  imports: [ShopifyModule, UserModule],
  exports: [InstallationService]
})
export class InstallationModule {}
