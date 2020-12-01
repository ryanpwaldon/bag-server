import { Body, Controller, Post } from '@nestjs/common'
import { CreateLeadDto } from 'src/modules/lead/dto/create-lead.dto'
import { LeadService } from 'src/modules/lead/lead.service'

@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadService.create(createLeadDto)
  }
}
