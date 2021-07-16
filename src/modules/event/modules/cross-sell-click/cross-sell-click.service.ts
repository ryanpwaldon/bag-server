import { Injectable } from '@nestjs/common'
import { Model, FilterQuery } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CrossSellClick } from './schema/cross-sell-click.schema'

@Injectable()
export class CrossSellClickService {
  constructor(
    @InjectModel(CrossSellClick.name)
    private readonly crossSellClickModel: Model<CrossSellClick>
  ) {}

  create(data: Partial<CrossSellClick>) {
    new this.crossSellClickModel(data).save()
  }

  findAll(query: FilterQuery<CrossSellClick>) {
    return this.crossSellClickModel.find(query, null, { populate: 'crossSell' })
  }
}
