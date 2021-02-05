import { forwardRef, Module } from '@nestjs/common'
import { MailModule } from 'src/modules/mail/mail.module'
import { NotificationService } from './notification.service'
import { ConversionModule } from 'src/modules/conversion/conversion.module'

@Module({
  imports: [MailModule, forwardRef(() => ConversionModule)],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
