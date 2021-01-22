import { Module } from '@nestjs/common'
import { ThemeService } from './theme.service'
import { UserModule } from 'src/modules/user/user.module'
import { AdminModule } from 'src/modules/admin/admin.module'

@Module({
  imports: [AdminModule, UserModule],
  providers: [ThemeService],
  exports: [ThemeService]
})
export class ThemeModule {}
