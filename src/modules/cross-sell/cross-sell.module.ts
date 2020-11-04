import { Module } from '@nestjs/common'
import { CrossSellController } from './cross-sell.controller'
import { CrossSellService } from './cross-sell.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CrossSellSchema, CrossSell } from './schema/cross-sell.schema'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: CrossSell.name,
        schema: CrossSellSchema
      }
    ])
  ],
  controllers: [CrossSellController],
  providers: [CrossSellService]
})
export class CrossSellModule {}
