import { Response } from 'express'
import { FilterQuery } from 'mongoose'
import { User } from 'src/modules/user/schema/user.schema'
import { UserService } from 'src/modules/user/user.service'
import { AffiliateService } from 'src/modules/affiliate/affiliate.service'
import { BadRequestException, Body, Controller, Get, Post, Query, Res } from '@nestjs/common'

@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly userService: UserService, private readonly affiliateService: AffiliateService) {}

  @Post('login')
  async login(@Body('email') email: string) {
    if (!email) throw new BadRequestException()
    return this.affiliateService.login(email)
  }

  @Get('auth')
  auth(@Query('authToken') authToken: string, @Res() res: Response) {
    return this.affiliateService.auth(authToken, res)
  }

  @Get('referrals')
  findMyReferrals(
    @Query('page') page: number,
    @Query('sort') sort: string,
    @Query('limit') limit: number,
    @Query('query') query: FilterQuery<User> = {}
  ) {
    // query.affiliate = affiliate.id
    return this.userService.findAll(query, page, limit, sort)
  }
}
