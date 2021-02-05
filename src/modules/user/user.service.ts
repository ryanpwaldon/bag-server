import { CreateUserDto } from './dto/create-user.dto'
import { Model, FilterQuery, LeanDocument } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { User } from './schema/user.schema'
import assign from 'lodash/assign'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return new this.userModel(createUserDto).save()
  }

  findById(id?: string) {
    return this.userModel.findById(id).exec()
  }

  findOne(query: FilterQuery<User>) {
    return this.userModel.findOne(query).exec()
  }

  async updateOneById(id: string, body: LeanDocument<User>): Promise<User> {
    const user = await this.userModel.findById(id)
    return assign(user, body).save()
  }
}
