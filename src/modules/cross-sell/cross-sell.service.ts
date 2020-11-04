import { Injectable, Scope, Inject } from '@nestjs/common'
import { CreateCrossSellDto } from './dto/create-cross-sell.dto'
import { InjectModel } from '@nestjs/mongoose'
import { CrossSell } from './schema/cross-sell.schema'
import { REQUEST } from '@nestjs/core'
import { PaginateModel, PaginateResult } from 'mongoose'
import { merge } from 'lodash'

@Injectable({ scope: Scope.REQUEST })
export class CrossSellService {
  constructor(
    @Inject(REQUEST) private req,
    @InjectModel(CrossSell.name) private readonly crossSellModel: PaginateModel<CrossSell>
  ) {}

  async create(createCrossSellDto: CreateCrossSellDto): Promise<CrossSell> {
    const crossSell = new this.crossSellModel(createCrossSellDto)
    crossSell.user = this.req.user.id
    return crossSell.save()
  }

  findAll(query, sort, page = 1, limit = 20): Promise<PaginateResult<CrossSell>> {
    return this.crossSellModel.paginate(query, { sort, page, limit })
  }

  findOneById(id): Promise<CrossSell> {
    return this.crossSellModel.findById(id).exec()
  }

  async updateOneById(id, body): Promise<CrossSell> {
    const crossSell = await this.crossSellModel.findById(id)
    return merge(crossSell, body).save()
  }

  deleteOneById(id): Promise<CrossSell> {
    return this.crossSellModel.findByIdAndDelete(id).exec()
  }
}
