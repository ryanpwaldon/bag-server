import { Module } from '@nestjs/common'
import { MailModule } from 'src/modules/mail/mail.module'
import { NotificationService } from './notification.service'
import { ConversionModule } from 'src/modules/conversion/conversion.module'

@Module({
  exports: [NotificationService],
  providers: [NotificationService],
  imports: [MailModule, ConversionModule]
})
export class NotificationModule {}
