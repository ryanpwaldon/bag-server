import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AffiliateService } from './affiliate.service'
import { UserModule } from 'src/modules/user/user.module'
import { MailModule } from 'src/modules/mail/mail.module'
import { AffiliateController } from './affiliate.controller'
import { AffiliateCodeModule } from 'src/modules/affiliate-code/affiliate-code.module'
import { Affiliate, AffiliateSchema } from 'src/modules/affiliate/schema/affiliate.schema'

@Module({
  imports: [
    UserModule,
    MailModule,
    AffiliateCodeModule,
    MongooseModule.forFeature([
      {
        name: Affiliate.name,
        schema: AffiliateSchema
      }
    ])
  ],
  providers: [AffiliateService],
  controllers: [AffiliateController],
  exports: [AffiliateService]
})
export class AffiliateModule {}
