import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { User, UserSchema } from './schema/user.schema'
import { UserController } from './user.controller'
import { AdminModule } from '../admin/admin.module'

@Module({
  imports: [
    AdminModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
