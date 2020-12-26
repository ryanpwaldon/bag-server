import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Model, FilterQuery } from 'mongoose'
import { CrossSellImpression } from './schema/cross-sell-impression.schema'

@Injectable()
export class CrossSellImpressionService {
  constructor(
    @InjectModel(CrossSellImpression.name)
    private readonly crossSellImpressionModel: Model<CrossSellImpression>
  ) {}

  create(data: Partial<CrossSellImpression>) {
    new this.crossSellImpressionModel(data).save()
  }

  findAll(query: FilterQuery<CrossSellImpression>) {
    return this.crossSellImpressionModel.find(query, null, { populate: 'crossSell' })
  }
}
