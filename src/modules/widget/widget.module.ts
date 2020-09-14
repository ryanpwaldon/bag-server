import { Module } from '@nestjs/common'
import { WidgetController } from './widget.controller'
import { WidgetService } from './widget.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Widget, WidgetSchema } from './schema/widget.schema'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Widget.name,
        schema: WidgetSchema
      }
    ])
  ],
  controllers: [WidgetController],
  providers: [WidgetService],
  exports: [WidgetService]
})
export class WidgetModule {}
