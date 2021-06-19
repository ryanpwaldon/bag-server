import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { UserModule } from 'src/modules/user/user.module'
import { AffiliateModule } from 'src/modules/affiliate/affiliate.module'
import { TransactionModule } from 'src/modules/transaction/transaction.module'
import { HoneybadgerModule } from 'src/modules/honeybadger/honeybadger.module'
import { NotificationModule } from 'src/modules/notification/notification.module'

@Module({
  imports: [UserModule, TransactionModule, AffiliateModule, HoneybadgerModule, NotificationModule],
  providers: [TaskService]
})
export class TaskModule {}
