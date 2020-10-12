import { Injectable, Scope, Inject } from '@nestjs/common'
import { CreateOfferDto } from './dto/create-offer.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Offer } from './schema/offer.schema'
import { REQUEST } from '@nestjs/core'
import { PaginateModel, PaginateResult } from 'mongoose'
import { merge } from 'lodash'

@Injectable({ scope: Scope.REQUEST })
export class OfferService {
  constructor(
    @Inject(REQUEST) private req,
    @InjectModel(Offer.name) private readonly offerModel: PaginateModel<Offer>
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = new this.offerModel(createOfferDto)
    offer.user = this.req.user.id
    return offer.save()
  }

  findAll(query, sort, page, limit): Promise<PaginateResult<Offer>> {
    return this.offerModel.paginate(query, { sort, page, limit })
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
