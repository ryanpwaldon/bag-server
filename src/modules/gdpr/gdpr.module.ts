import { Module } from '@nestjs/common'
import { GdprController } from './gdpr.controller'

@Module({
  controllers: [GdprController]
})
export class GdprModule {}
