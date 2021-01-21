import { Module } from '@nestjs/common'
import { ThemeService } from './theme.service'

@Module({
  providers: [ThemeService]
})
export class ThemeModule {}
