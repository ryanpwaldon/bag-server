import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateLeadDto } from 'src/modules/lead/dto/create-lead.dto'
import { Lead } from 'src/modules/lead/schema/lead.schema'
import { Model } from 'mongoose'

@Injectable()
export class LeadService {
  constructor(@InjectModel(Lead.name) private readonly leadModel: Model<Lead>) {}

  async create(createLeadDto: CreateLeadDto) {
    return new this.leadModel(createLeadDto).save()
  }
}
