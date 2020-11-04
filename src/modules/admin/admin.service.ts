import { Injectable, HttpService, Scope, Inject, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { REQUEST } from '@nestjs/core'
import { Error } from '../../common/constants/error.constants'
import { Logger } from 'nestjs-pino'

@Injectable({ scope: Scope.REQUEST })
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    @Inject(REQUEST) private req
  ) {}

  async createRequest(data) {
    const method = 'post'
    const { shopOrigin, accessToken } = this.req.user
    const url = `https://${shopOrigin}/admin/api/${this.configService.get('SHOPIFY_API_VERSION')}/graphql.json`
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken }
    const response = await this.httpService.request({ method, headers, url, data }).toPromise()
    if (response.data.errors) {
      this.logger.error(JSON.stringify(response.data.errors))
      throw new UnauthorizedException(Error.ShopifyAuthorizationError)
    }
    return response.data
  }
}
