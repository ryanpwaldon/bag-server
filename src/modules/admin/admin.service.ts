import { Request } from 'express'
import { Logger } from 'nestjs-pino'
import { REQUEST } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/modules/user/schema/user.schema'
import { Injectable, HttpService, Scope, Inject, InternalServerErrorException } from '@nestjs/common'

@Injectable({ scope: Scope.REQUEST })
export class AdminService {
  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private request: Request & { user: User }
  ) {}

  async createRequest(data: any) {
    const method = 'post'
    const { shopOrigin, accessToken } = this.request.user
    const url = `https://${shopOrigin}/admin/api/${this.configService.get('SHOPIFY_API_VERSION')}/graphql.json`
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken }
    const response = await this.httpService.request({ method, headers, url, data }).toPromise()
    if (response.data.errors) {
      this.logger.error(JSON.stringify(response.data.errors))
      throw new InternalServerErrorException('Admin API error.')
    }
    return response.data
  }
}
