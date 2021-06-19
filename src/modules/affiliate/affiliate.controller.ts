import { Response } from 'express'
import { FilterQuery, LeanDocument } from 'mongoose'
import { User } from 'src/modules/user/schema/user.schema'
import { UserService } from 'src/modules/user/user.service'
import { AffiliateGuard } from 'src/common/guards/affiliate.guard'
import { GetAffiliate } from 'src/common/decorators/affiliate.decorator'
import { Affiliate } from 'src/modules/affiliate/schema/affiliate.schema'
import { AffiliateService } from 'src/modules/affiliate/affiliate.service'
import { BadRequestException, Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common'

@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly userService: UserService, private readonly affiliateService: AffiliateService) {}

  @Get()
  @UseGuards(AffiliateGuard)
  async findMe(@GetAffiliate('id') affiliateId: string) {
    return this.affiliateService.findById(affiliateId)
  }

  @Post('login')
  async login(@Body('email') email: string) {
    if (!email) throw new BadRequestException()
    return this.affiliateService.login(email)
  }

  @Post()
  @UseGuards(AffiliateGuard)
  updateMe(@GetAffiliate() affiliate: Affiliate, @Body() body: LeanDocument<Affiliate>) {
    return this.affiliateService.updateMe(affiliate, body)
  }

  @Get('logout')
  @UseGuards(AffiliateGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('sessionToken', { sameSite: 'none', secure: true })
    res.send()
  }

  @Get('auth')
  auth(@Query('authToken') authToken: string, @Res() res: Response) {
    return this.affiliateService.auth(authToken, res)
  }

  @Get('referrals/stats')
  @UseGuards(AffiliateGuard)
  async findMyReferralStats(@GetAffiliate() affiliate: Affiliate) {
    const referrals = (await this.userService.findAll({ affiliate: affiliate.id }, 1, Number.MAX_SAFE_INTEGER)).docs
    const total = referrals.length
    const active = referrals.filter(referral => !referral.uninstalled).length
    const churned = total - active
    return { total, active, churned }
  }

  @Get('referrals')
  @UseGuards(AffiliateGuard)
  findMyReferrals(
    @GetAffiliate() affiliate: Affiliate,
    @Query('page') page: number,
    @Query('sort') sort: string,
    @Query('limit') limit: number,
    @Query('query') query: FilterQuery<User> = {}
  ) {
    query.affiliate = affiliate.id
    return this.userService.findAll(query, page, limit, sort)
  }

  @Post('code')
  @UseGuards(AffiliateGuard)
  updateCode(@GetAffiliate() affiliate: Affiliate, @Body('code') code: string) {
    return this.affiliateService.updateCode(affiliate, code)
  }
}
