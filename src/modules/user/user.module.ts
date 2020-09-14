import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { User, UserSchema, beforeSave } from './schema/user.schema'
import { UserController } from './user.controller'
import { ShopifyModule } from '../shopify/shopify.module'

@Module({
  imports: [
    ShopifyModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema
          schema.pre('save', beforeSave)
          return schema
        }
      }
    ])
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
