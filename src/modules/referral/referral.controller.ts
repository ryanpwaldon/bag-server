import moment from 'moment'
import { Response } from 'express'
import { Controller, Get, Query, Res } from '@nestjs/common'
import { AffiliateService } from 'src/modules/affiliate/affiliate.service'
import { AffiliateCodeService } from '../affiliate-code/affiliate-code.service'

@Controller('referral')
export class ReferralController {
  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly affiliateCodeService: AffiliateCodeService
  ) {}

  @Get('track')
  async track(@Res() res: Response, @Query('affiliateCode') affiliateCode: string) {
    if (!affiliateCode) return res.send(false)
    const affiliateId = (await this.affiliateCodeService.findOne({ code: affiliateCode }))?.affiliate
    if (!affiliateId) return res.send(false)
    res.cookie('affiliateCode', affiliateCode, {
      expires: moment()
        .add(10, 'years')
        .toDate(),
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })
    res.send(true)
    const affiliate = await this.affiliateService.findById(affiliateId)
    if (affiliate) {
      affiliate.linkClicks++
      affiliate.save()
    }
  }
}
