import moment from 'moment'
import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { customAlphabet } from 'nanoid'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { FilterQuery, PaginateModel, Types } from 'mongoose'
import { Template } from 'src/modules/mail/types/template'
import { MailService, Persona } from 'src/modules/mail/mail.service'
import { Affiliate } from 'src/modules/affiliate/schema/affiliate.schema'
import { AffiliateCodeService } from 'src/modules/affiliate-code/affiliate-code.service'

@Injectable()
export class AffiliateService {
  authSecret!: string
  sessionSecret!: string
  affiliateUrl!: string
  serverHost!: string

  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly affiliateCodeService: AffiliateCodeService,
    @InjectModel(Affiliate.name) private readonly affiliateModel: PaginateModel<Affiliate>
  ) {
    this.authSecret = this.configService.get('AUTH_SECRET_KEY') as string
    this.sessionSecret = this.configService.get('SESSION_SECRET_KEY') as string
    this.affiliateUrl = this.configService.get('AFFILIATE_URL') as string
    this.serverHost = this.configService.get('SERVER_HOST') as string
  }

  async create(email: string) {
    const affiliate = await new this.affiliateModel({ email }).save()
    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 6)
    const affiliateCode = await this.affiliateCodeService.create(affiliate.id as string, nanoid())
    affiliate.code = affiliateCode.code
    return affiliate.save()
  }

  async login(email: string) {
    const authToken = jwt.sign({}, this.authSecret, { expiresIn: '5m', subject: email })
    const authUrl = `https://${this.serverHost}/affiliate/auth?authToken=${authToken}`
    this.mailService.sendWithTemplate({
      to: email,
      templateModel: { authUrl, date: moment().format('DD MMMM YYYY') },
      from: Persona.Notifications,
      template: Template.AffiliateLogin
    })
  }

  async auth(authToken: string, res: Response) {
    try {
      const authTokenPayload = jwt.verify(authToken, this.authSecret) as { sub: string }
      const affiliateEmail = authTokenPayload.sub
      const affiliate = (await this.findOne({ email: affiliateEmail })) || (await this.create(affiliateEmail))
      const sessionToken = jwt.sign({}, this.sessionSecret, { expiresIn: '7d', subject: affiliate.id })
      res.cookie('sessionToken', sessionToken, {
        expires: moment()
          .add(7, 'days')
          .toDate(),
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })
      res.redirect(`${this.affiliateUrl}/dashboard`)
    } catch (err) {
      console.log(err)
      res.redirect(`${this.affiliateUrl}/login`)
    }
  }

  findById(id: string | Types.ObjectId) {
    return this.affiliateModel.findById(id).exec()
  }

  findOne(query: FilterQuery<Affiliate>) {
    return this.affiliateModel.findOne(query)
  }
}
