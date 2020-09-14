import { Module } from '@nestjs/common'
import { DiscountController } from './discount.controller'
import { DiscountService } from './discount.service'
import { MongooseModule } from '@nestjs/mongoose'
import { DiscountSchema, Discount } from './schema/discount.schema'
import { ShopifyModule } from '../shopify/shopify.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    ShopifyModule,
    MongooseModule.forFeature([
      {
        name: Discount.name,
        schema: DiscountSchema
      }
    ])
  ],
  controllers: [DiscountController],
  providers: [DiscountService]
})
export class DiscountModule {}
