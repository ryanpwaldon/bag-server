import { Injectable } from '@nestjs/common'
import { Model, FilterQuery } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ProgressBarImpression } from './schema/progress-bar-impression.schema'

@Injectable()
export class ProgressBarImpressionService {
  constructor(
    @InjectModel(ProgressBarImpression.name)
    private readonly progressBarImpressionModel: Model<ProgressBarImpression>
  ) {}

  create(data: Partial<ProgressBarImpression>) {
    new this.progressBarImpressionModel(data).save()
  }

  findAll(query: FilterQuery<ProgressBarImpression>) {
    return this.progressBarImpressionModel.find(query, null, { populate: 'progressBar' })
  }
}
