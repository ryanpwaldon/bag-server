import { Response } from 'express'
import { FilterQuery } from 'mongoose'
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
}
