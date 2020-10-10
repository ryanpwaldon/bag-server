import { Injectable, Scope, Inject } from '@nestjs/common'
import { CreateOfferDto } from './dto/create-offer.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Offer } from './schema/offer.schema'
import { REQUEST } from '@nestjs/core'
import { Model } from 'mongoose'
import { merge } from 'lodash'

@Injectable({ scope: Scope.REQUEST })
export class OfferService {
  constructor(@Inject(REQUEST) private req, @InjectModel(Offer.name) private readonly offerModel: Model<Offer>) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = new this.offerModel(createOfferDto)
    offer.user = this.req.user.id
    return offer.save()
  }

  async findAll(filters, page, itemsPerPage): Promise<FindAllResponse<Offer>> {
    itemsPerPage = parseInt(itemsPerPage)
    const skip = (page - 1) * itemsPerPage
    const items = await this.offerModel
      .find(filters)
      .skip(skip)
      .limit(itemsPerPage)
      .exec()
    const first = skip + 1
    const last = first + items.length - 1
    const total = await this.offerModel.where(filters).countDocuments()
    const pages = Math.ceil(total / itemsPerPage)
    return { items, total, first, last, pages, page }
  }

  findOneById(id): Promise<Offer> {
    return this.offerModel.findById(id).exec()
  }

  async updateOneById(id, body): Promise<Offer> {
    const offer = await this.offerModel.findById(id)
    return merge(offer, body).save()
  }

  deleteOneById(id): Promise<Offer> {
    return this.offerModel.findByIdAndDelete(id).exec()
  }
}
