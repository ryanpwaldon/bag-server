import { Module } from '@nestjs/common'
import { MigrationService } from './migration.service'

@Module({
  imports: [],
  providers: [MigrationService]
})
export class MigrationModule {}
