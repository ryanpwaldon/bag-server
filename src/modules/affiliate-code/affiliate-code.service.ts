import { FilterQuery, Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AffiliateCode } from 'src/modules/affiliate-code/schema/affiliate-code.schema'

@Injectable()
export class AffiliateCodeService {
  constructor(@InjectModel(AffiliateCode.name) private readonly affiliateCodeModel: Model<AffiliateCode>) {}

  create(affiliateId: string, code: string) {
    return new this.affiliateCodeModel({ affiliate: affiliateId, code }).save()
  }

  findOne(query: FilterQuery<AffiliateCode>) {
    return this.affiliateCodeModel.findOne(query)
  }
}
