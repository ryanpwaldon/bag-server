import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConversionService } from './conversion.service'
import { UserModule } from 'src/modules/user/user.module'
import { EventModule } from 'src/modules/event/event.module'
import { ConversionController } from './conversion.controller'
import { ProgressBarModule } from 'src/modules/progress-bar/progress-bar.module'
import { NotificationModule } from 'src/modules/notification/notification.module'
import { Conversion, ConversionSchema } from 'src/modules/conversion/schema/conversion.schema'

@Module({
  imports: [
    UserModule,
    EventModule,
    ProgressBarModule,
    forwardRef(() => NotificationModule),
    MongooseModule.forFeature([
      {
        name: Conversion.name,
        schema: ConversionSchema
      }
    ])
  ],
  providers: [ConversionService],
  exports: [ConversionService],
  controllers: [ConversionController]
})
export class ConversionModule {}
