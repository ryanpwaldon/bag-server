import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConversionService } from './conversion.service'
import { EventModule } from 'src/modules/event/event.module'
import { Conversion, ConversionSchema } from 'src/modules/conversion/schema/conversion.schema'

@Module({
  imports: [
    EventModule,
    MongooseModule.forFeature([
      {
        name: Conversion.name,
        schema: ConversionSchema
      }
    ])
  ],
  providers: [ConversionService],
  exports: [ConversionService]
})
export class ConversionModule {}
