import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Conversion } from 'src/modules/conversion/schema/conversion.schema'

@Injectable()
export class ConversionService {
  constructor(@InjectModel(Conversion.name) private readonly conversionModel: Model<Conversion>) {}

  create(data: Partial<Conversion>) {
    const conversion = new this.conversionModel(data)
    return conversion.save()
  }
}
