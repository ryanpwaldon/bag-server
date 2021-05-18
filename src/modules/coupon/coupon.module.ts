import { Module } from '@nestjs/common'
import { CouponService } from './coupon.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CouponController } from './coupon.controller'
import { Coupon, CouponSchema } from './schema/coupon.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coupon.name,
        schema: CouponSchema
      }
    ])
  ],
  controllers: [CouponController],
  providers: [CouponService]
})
export class CouponModule {}
