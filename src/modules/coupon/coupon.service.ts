import { Model } from 'mongoose'
import { customAlphabet } from 'nanoid'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Coupon } from 'src/modules/coupon/schema/coupon.schema'

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>) {}

  findOneByCode(code: string) {
    return this.couponModel.findOne({ code })
  }

  async redeem(code: string) {
    const coupon = await this.findOneByCode(code)
    if (!coupon || coupon.redeemed) throw new BadRequestException()
    coupon.redeemed = true
    coupon.save()
  }

  async generateCodes() {
    const coupons = []
    const amountToGenerate = 100
    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)
    for (let i = 0; i < amountToGenerate; i++) coupons.push(new this.couponModel({ code: nanoid() }))
    const savedCoupons = (await Promise.all(coupons.map(coupon => coupon.save().catch(() => null)))).filter(
      coupon => !!coupon
    ) as Coupon[]
    console.log(savedCoupons.map(savedCoupon => savedCoupon.code))
    console.log(`Codes generated: ${savedCoupons.length}`)
  }
}
