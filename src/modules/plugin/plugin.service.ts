import { Injectable, Scope, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Plugin } from './schema/plugin.schema'
import { Model, MongooseFilterQuery, Schema } from 'mongoose'
import { merge } from 'lodash'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { User } from 'src/modules/user/schema/user.schema'

@Injectable({ scope: Scope.REQUEST })
export class PluginService {
  constructor(
    @Inject(REQUEST) private req: Request & { user: User },
    @InjectModel(Plugin.name) private readonly pluginModel: Model<Plugin>
  ) {}

  async findMyOrCreate(): Promise<Plugin> {
    const userId = this.req.user.id
    const plugin = await this.pluginModel.findOne({ user: userId })
    return plugin || new this.pluginModel({ user: userId }).save()
  }

  findOne(query: MongooseFilterQuery<Plugin>) {
    return this.pluginModel.findOne(query).exec()
  }

  async updateMy(userId: Schema.Types.ObjectId, body: Partial<Plugin>): Promise<Plugin> {
    const plugin = await this.pluginModel.findOne({ user: userId })
    return merge(plugin, body).save()
  }
}
