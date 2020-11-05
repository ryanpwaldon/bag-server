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

  async create() {
    const userId = this.req.user.id
    const plugin = await this.pluginModel.findOne({ user: userId })
    return plugin || new this.pluginModel({ user: userId }).save()
  }

  findOne(query: MongooseFilterQuery<Plugin>) {
    return this.pluginModel.findOne(query).exec()
  }

  async updateOne(query: MongooseFilterQuery<Plugin>, body: Partial<Plugin>): Promise<Plugin> {
    const plugin = await this.pluginModel.findOne(query)
    return merge(plugin, body).save()
  }
}
