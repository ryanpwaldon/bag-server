import assign from 'lodash/assign'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'
import { ProgressBar } from 'src/modules/progress-bar/schema/progress-bar.schema'

@Injectable()
export class ProgressBarService {
  constructor(@InjectModel(ProgressBar.name) private readonly progressBarModel: PaginateModel<ProgressBar>) {}

  async create(data: Partial<ProgressBar>) {
    const progressBar = new this.progressBarModel(data)
    return progressBar.save()
  }

  findAll(query: FilterQuery<ProgressBar>, options: PaginateOptions = { page: 1, limit: 20 }) {
    return this.progressBarModel.paginate(query, options)
  }

  findOneById(id: string) {
    return this.progressBarModel.findById(id).exec()
  }

  async updateOneById(id: string, body: Partial<ProgressBar>): Promise<ProgressBar> {
    const progressBar = await this.progressBarModel.findById(id)
    return assign(progressBar, body).save()
  }

  deleteOneById(id: string) {
    return this.progressBarModel.findByIdAndDelete(id).exec()
  }
}
