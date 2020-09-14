import { Injectable, Scope, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Widget } from './schema/widget.schema'
import { Model } from 'mongoose'
import { merge } from 'lodash'
import { REQUEST } from '@nestjs/core'

@Injectable({ scope: Scope.REQUEST })
export class WidgetService {
  constructor(@Inject(REQUEST) private req, @InjectModel(Widget.name) private readonly widgetModel: Model<Widget>) {}

  async findMyOrCreate(): Promise<Widget> {
    const userId = this.req.user.id
    const widget = await this.widgetModel.findOne({ user: userId })
    return widget || new this.widgetModel({ user: userId }).save()
  }

  async findOne(query): Promise<Widget> {
    return await this.widgetModel.findOne(query)
  }

  async updateMy(userId, body): Promise<Widget> {
    const widget = await this.widgetModel.findOne({ user: userId })
    return merge(widget, body).save()
  }
}
