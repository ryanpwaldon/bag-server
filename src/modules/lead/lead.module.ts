import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Lead, LeadSchema } from 'src/modules/lead/schema/lead.schema'
import { MailModule } from 'src/modules/mail/mail.module'
import { LeadController } from './lead.controller'
import { LeadService } from './lead.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lead.name,
        schema: LeadSchema
      }
    ]),
    MailModule
  ],
  controllers: [LeadController],
  providers: [LeadService]
})
export class LeadModule {}
