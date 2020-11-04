import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, MongooseFilterQuery } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './schema/user.schema'
import { merge } from 'lodash'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return new this.userModel(createUserDto).save()
  }

  findById(id: string) {
    return this.userModel.findById(id).exec()
  }

  findOne(query: MongooseFilterQuery<User>) {
    return this.userModel.findOne(query).exec()
  }

  async updateOneById(id: string, body: Partial<User>): Promise<User> {
    const user = await this.userModel.findById(id)
    return merge(user, body).save()
  }
}
