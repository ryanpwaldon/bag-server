import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './schema/user.schema'
import { merge } from 'lodash'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly adminService: AdminService
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return new this.userModel(createUserDto).save()
  }

  findById(id): Promise<User> {
    return this.userModel.findById(id).exec()
  }

  findOne(query): Promise<User> {
    return this.userModel.findOne(query).exec()
  }

  async updateOneById(id, body): Promise<User> {
    const user = await this.userModel.findById(id)
    return merge(user, body).save()
  }

  async attachDetails(user) {
    user = user.toObject()
    const { data } = await this.adminService.createRequest({
      query: `
        {
          shop {
            email
            name
          }
        }
      `
    })
    user['details'] = data.shop
    return user
  }
}
