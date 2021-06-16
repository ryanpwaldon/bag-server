import { PartnerService } from './partner.service'
import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SHOPIFY_PARTNER_API_VERSION, SHOPIFY_PARTNER_ORGANIZATION_ID } from 'src/common/constants'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': configService.get<string>('SHOPIFY_PARTNER_API_ACCESS_TOKEN')
        },
        baseURL: `https://partners.shopify.com/${SHOPIFY_PARTNER_ORGANIZATION_ID}/api/${SHOPIFY_PARTNER_API_VERSION}/graphql.json`
      })
    })
  ],
  providers: [PartnerService],
  exports: [PartnerService]
})
export class PartnerModule {}
