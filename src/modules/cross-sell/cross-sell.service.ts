import { Injectable, Scope, Inject } from '@nestjs/common'
import { CreateCrossSellDto } from './dto/create-cross-sell.dto'
import { InjectModel } from '@nestjs/mongoose'
import { CrossSell } from './schema/cross-sell.schema'
import { REQUEST } from '@nestjs/core'
import { MongooseFilterQuery, PaginateModel } from 'mongoose'
import assign from 'lodash/assign'
import { Request } from 'express'
import { User } from 'src/modules/user/schema/user.schema'

@Injectable({ scope: Scope.REQUEST })
export class CrossSellService {
  constructor(
    @Inject(REQUEST) private req: Request & { user: User },
    @InjectModel(CrossSell.name) private readonly crossSellModel: PaginateModel<CrossSell>
  ) {}

  async create(createCrossSellDto: CreateCrossSellDto) {
    const crossSell = new this.crossSellModel(createCrossSellDto)
    crossSell.user = this.req.user.id
    return crossSell.save()
  }

  findAll(query: MongooseFilterQuery<CrossSell>, sort: string, page = 1, limit = 20) {
    return this.crossSellModel.paginate(query, { sort, page, limit })
  }

  findOneById(id: string) {
    return this.crossSellModel.findById(id).exec()
  }

  async updateOneById(id: string, body: Partial<CrossSell>): Promise<CrossSell> {
    const crossSell = await this.crossSellModel.findById(id)
    return assign(crossSell, body).save()
  }

  deleteOneById(id: string) {
    return this.crossSellModel.findByIdAndDelete(id).exec()
  }
}
