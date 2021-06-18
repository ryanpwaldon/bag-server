import { FilterQuery, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { BadRequestException, Injectable } from '@nestjs/common'
import { AffiliateCode } from 'src/modules/affiliate-code/schema/affiliate-code.schema'

@Injectable()
export class AffiliateCodeService {
  constructor(@InjectModel(AffiliateCode.name) private readonly affiliateCodeModel: Model<AffiliateCode>) {}

  async create(affiliateId: string, code: string) {
    const validCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for (const char of code) if (!validCharacters.includes(char)) throw new BadRequestException()
    const affiliateCodeAlreadyOwned = await this.findOne({ affiliate: affiliateId, code })
    console.log(affiliateCodeAlreadyOwned)
    if (affiliateCodeAlreadyOwned) return affiliateCodeAlreadyOwned
    const affiliateCodeOwnedBySomeoneElse = await this.findOne({ code })
    if (affiliateCodeOwnedBySomeoneElse) throw new BadRequestException()
    return new this.affiliateCodeModel({ affiliate: affiliateId, code }).save()
  }

  findOne(query: FilterQuery<AffiliateCode>) {
    return this.affiliateCodeModel.findOne(query)
  }
}
