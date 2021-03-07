import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from 'src/modules/user/user.module'
import { ProgressBarService } from './progress-bar.service'
import { PluginGuard } from 'src/common/guards/plugin.guard'
import { ProgressBarController } from './progress-bar.controller'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { ProgressBar, ProgressBarSchema } from './schema/progress-bar.schema'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: ProgressBar.name,
        schema: ProgressBarSchema
      }
    ])
  ],
  controllers: [ProgressBarController],
  providers: [ProgressBarService, EmbeddedAppGuard, PluginGuard],
  exports: [ProgressBarService]
})
export class ProgressBarModule {}
