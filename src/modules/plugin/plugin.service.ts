import { Injectable, Scope, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Plugin } from './schema/plugin.schema'
import { Model } from 'mongoose'
import { merge } from 'lodash'
import { REQUEST } from '@nestjs/core'

@Injectable({ scope: Scope.REQUEST })
export class PluginService {
  constructor(@Inject(REQUEST) private req, @InjectModel(Plugin.name) private readonly pluginModel: Model<Plugin>) {}

  async findMyOrCreate(): Promise<Plugin> {
    const userId = this.req.user.id
    const plugin = await this.pluginModel.findOne({ user: userId })
    return plugin || new this.pluginModel({ user: userId }).save()
  }

  async findOne(query): Promise<Plugin> {
    return await this.pluginModel.findOne(query)
  }

  async updateMy(userId, body): Promise<Plugin> {
    const plugin = await this.pluginModel.findOne({ user: userId })
    return merge(plugin, body).save()
  }
}
