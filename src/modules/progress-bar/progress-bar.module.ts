import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from 'src/modules/user/user.module'
import { ProgressBarService } from './progress-bar.service'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { ProgressBarController } from './progress-bar.controller'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { ProgressBar, ProgressBarSchema, updateActivePeriods } from './schema/progress-bar.schema'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: ProgressBar.name,
        useFactory: () => {
          const schema = ProgressBarSchema
          schema.pre('save', updateActivePeriods)
          return schema
        }
      }
    ])
  ],
  controllers: [ProgressBarController],
  providers: [ProgressBarService, EmbeddedAppGuard, PluginGuard],
  exports: [ProgressBarService]
})
export class ProgressBarModule {}
