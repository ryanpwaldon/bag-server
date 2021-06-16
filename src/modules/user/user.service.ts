import assign from 'lodash/assign'
import { Injectable } from '@nestjs/common'
import { User } from './schema/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { SalesService } from 'src/modules/sales/sales.service'
import { FilterQuery, LeanDocument, PaginateModel } from 'mongoose'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: PaginateModel<User>,
    private readonly salesService: SalesService
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return new this.userModel(createUserDto).save()
  }

  findAll(query: FilterQuery<User>, page?: number, limit?: number, sort?: string) {
    page = page || 1
    limit = limit || 20
    sort = sort || '-createdAt'
    return this.userModel.paginate(query, { sort, page, limit })
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

  async updateMonthlySalesRecords(user: User): Promise<User> {
    const monthlySalesRecord = await this.salesService.fetchMonthlySalesRecord(user)
    user.monthlySalesRecords[monthlySalesRecord.startTime.toISOString()] = monthlySalesRecord
    user.markModified('monthlySalesRecords')
    return user.save()
  }
}
