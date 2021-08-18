import assign from 'lodash/assign'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CrossSell } from './schema/cross-sell.schema'
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'

@Injectable()
export class CrossSellService {
  constructor(@InjectModel(CrossSell.name) private readonly crossSellModel: PaginateModel<CrossSell>) {}

  async create(data: Partial<CrossSell>) {
    const crossSell = new this.crossSellModel(data)
    return crossSell.save()
  }

  findAll(query: FilterQuery<CrossSell>, options: PaginateOptions = { page: 1, limit: 20 }) {
    return this.crossSellModel.paginate(query, options)
  }

  findOneById(id: string) {
    return this.crossSellModel.findById(id).exec()
  }

  findByIds(ids: string[]) {
    return this.crossSellModel.find().where('_id').in(ids).select(['_id', 'title', 'subtitle', 'productId']).exec() // prettier-ignore
  }

  async updateOneById(id: string, body: Partial<CrossSell>): Promise<CrossSell> {
    const crossSell = await this.crossSellModel.findById(id)
    return assign(crossSell, body).save()
  }

  deleteOneById(id: string) {
    return this.crossSellModel.findByIdAndDelete(id).exec()
  }
}
