import { Body, Controller, Post } from '@nestjs/common'
import { CreateLeadDto } from 'src/modules/lead/dto/create-lead.dto'
import { LeadService } from 'src/modules/lead/lead.service'
import { MailService } from 'src/modules/mail/mail.service'
import { Template } from 'src/modules/mail/types/template'

@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService, private readonly mailService: MailService) {}

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    const lead = await this.leadService.create(createLeadDto)
    this.mailService.sendWithTemplate({ to: lead.email, template: Template.Welcome })
    return lead
  }
}
