import { Module } from '@nestjs/common'
import { PluginController } from './plugin.controller'
import { PluginService } from './plugin.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Plugin, PluginSchema } from './schema/plugin.schema'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Plugin.name,
        schema: PluginSchema
      }
    ])
  ],
  controllers: [PluginController],
  providers: [PluginService],
  exports: [PluginService]
})
export class PluginModule {}
