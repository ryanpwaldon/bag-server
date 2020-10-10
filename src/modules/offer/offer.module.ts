import { Module } from '@nestjs/common'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { MongooseModule } from '@nestjs/mongoose'
import { OfferSchema, Offer } from './schema/offer.schema'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Offer.name,
        schema: OfferSchema
      }
    ])
  ],
  controllers: [OfferController],
  providers: [OfferService]
})
export class OfferModule {}
