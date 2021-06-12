import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AffiliateCodeService } from './affiliate-code.service'
import { AffiliateCode, AffiliateCodeSchema } from 'src/modules/affiliate-code/schema/affiliate-code.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AffiliateCode.name,
        schema: AffiliateCodeSchema
      }
    ])
  ],
  providers: [AffiliateCodeService],
  exports: [AffiliateCodeService]
})
export class AffiliateCodeModule {}
