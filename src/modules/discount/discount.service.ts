import { Injectable, Scope, Inject, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Discount } from './schema/discount.schema'
import { Model } from 'mongoose'
import { CreateDiscountDto } from './dto/create-discount.dto'
import { ShopifyService } from '../shopify/shopify.service'
import { REQUEST } from '@nestjs/core'
import { merge } from 'lodash'
import { Role } from '../../common/constants/role.constants'
import { Error } from '../../common/constants/error.constants'

@Injectable({ scope: Scope.REQUEST })
export class DiscountService {
  constructor(
    @Inject(REQUEST) private req,
    @InjectModel(Discount.name) private readonly discountModel: Model<Discount>,
    private readonly shopifyService: ShopifyService
  ) {}

  async findOneOrCreate(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const query = { user: this.req.user.id, shopifyId: createDiscountDto.shopifyId }
    let discount = await this.discountModel.findOne(query)
    discount = discount || (await new this.discountModel(query).save())
    return this.attachShopifyDetails(discount)
  }

  async findAll(filters, page, itemsPerPage): Promise<FindAllResponse<Discount>> {
    let discounts = await this.discountModel
      .find(filters)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .exec()
    discounts = await Promise.all(discounts.map(discount => this.attachShopifyDetails(discount)))
    const seen = (page - 1) * itemsPerPage + discounts.length
    const total = await this.discountModel.where(filters).countDocuments()
    const hasNextPage = seen < total
    return {
      items: discounts,
      hasNextPage
    }
  }

  async findOneById(id): Promise<Discount> {
    const discount = await this.discountModel.findById(id).exec()
    return this.attachShopifyDetails(discount)
  }

  async updateOneById(id, body): Promise<Discount> {
    const user = this.req.user
    let discount = await this.discountModel.findById(id)
    merge(discount, body)
    if (discount.isModified('active') && discount.active && !user.roles.includes(Role.Premium)) {
      const discounts = await this.discountModel.find({ user: discount.user, active: true })
      if (discounts.length > 1) throw new UnauthorizedException(Error.PlanAuthorizationError)
    }
    discount = await discount.save()
    return this.attachShopifyDetails(discount)
  }

  async deleteOneById(id): Promise<Discount> {
    const discount = await this.discountModel.findByIdAndDelete(id)
    return this.attachShopifyDetails(discount)
  }

  async convertToShopifyId(shopifyLegacyResourceId: string) {
    const testableShopifyId = `gid://shopify/DiscountCodeNode/${shopifyLegacyResourceId}`
    const shopifyDiscount = await this.findOneViaShopifyById(testableShopifyId)
    return shopifyDiscount && shopifyDiscount.id
  }

  async attachShopifyDetails(discount: Discount) {
    discount = discount.toObject()
    discount['details'] = await this.findOneViaShopifyById(discount.shopifyId)
    return discount
  }

  async findOneViaShopifyById(id) {
    const { data } = await this.shopifyService.createRequest({
      query: `
        {
          codeDiscountNode(id: "${id}") {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                shortSummary
                startsAt
                status
                summary
                title
                usageLimit
              }
              ... on DiscountCodeBxgy {
                startsAt
                status
                summary
                title
                usageLimit
              }
              ... on DiscountCodeFreeShipping {
                shortSummary
                startsAt
                status
                summary
                title
                usageLimit
              }
            }
          }
        }
      `
    })
    return data.codeDiscountNode
  }
}
