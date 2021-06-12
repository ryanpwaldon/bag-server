import { Module } from '@nestjs/common'
import { ReferralController } from './referral.controller'
import { AffiliateModule } from 'src/modules/affiliate/affiliate.module'
import { AffiliateCodeModule } from 'src/modules/affiliate-code/affiliate-code.module'

@Module({
  imports: [AffiliateModule, AffiliateCodeModule],
  controllers: [ReferralController]
})
export class ReferralModule {}
