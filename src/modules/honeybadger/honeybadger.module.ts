import { Module } from '@nestjs/common'
import { HoneybadgerService } from './honeybadger.service'

@Module({
  providers: [HoneybadgerService],
  exports: [HoneybadgerService]
})
export class HoneybadgerModule {}
