import { MongooseFilterQuery, PaginateModel } from 'mongoose'
import { Injectable, Scope, Inject } from '@nestjs/common'
import { User } from 'src/modules/user/schema/user.schema'
import { CreateOfferDto } from './dto/create-offer.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Offer } from './schema/offer.schema'
import { REQUEST } from '@nestjs/core'
import assign from 'lodash/assign'
import { Request } from 'express'

@Injectable({ scope: Scope.REQUEST })
export class OfferService {
  constructor(
    @Inject(REQUEST) private req: Request & { user: User },
    @InjectModel(Offer.name) private readonly offerModel: PaginateModel<Offer>
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = new this.offerModel(createOfferDto)
    offer.user = this.req.user.id
    return offer.save()
  }

  findAll(query: MongooseFilterQuery<Offer>, sort: string, page = 1, limit = 20) {
    return this.offerModel.paginate(query, { sort, page, limit })
  }

  findOneById(id: string) {
    return this.offerModel.findById(id).exec()
  }

  async updateOneById(id: string, body: Partial<Offer>) {
    const offer = await this.offerModel.findById(id)
    return assign(offer, body).save()
  }

  deleteOneById(id: string) {
    return this.offerModel.findByIdAndDelete(id).exec()
  }
}
