import { Module, HttpModule } from '@nestjs/common'
import { AdminService } from './admin.service'

@Module({
  imports: [HttpModule],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
