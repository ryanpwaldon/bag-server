import { CouponService } from 'src/modules/coupon/coupon.service'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('redeem/:code')
  async redeem(@Param('code') code: string) {
    await this.couponService.redeem(code)
  }
}
