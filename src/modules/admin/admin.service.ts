import { Request } from 'express'
import { Logger } from 'nestjs-pino'
import { REQUEST } from '@nestjs/core'
import { User } from 'src/modules/user/schema/user.schema'
import { SHOPIFY_API_VERSION } from 'src/common/constants'
import { Injectable, HttpService, Scope, Inject, InternalServerErrorException } from '@nestjs/common'

@Injectable({ scope: Scope.REQUEST })
export class AdminService {
  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private request: Request & { user: User }
  ) {}

  async createGraphQLRequest(data: any) {
    const method = 'post'
    const { shopOrigin, accessToken } = this.request.user
    const url = `https://${shopOrigin}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken }
    const response = await this.httpService.request({ method, headers, url, data }).toPromise()
    if (response.data.errors) {
      this.logger.error(JSON.stringify(response.data.errors))
      throw new InternalServerErrorException('Admin GraphQL API error.')
    }
    return response.data
  }

  async createRestRequest(method: 'post' | 'get' | 'put', path: string, data?: any) {
    const { shopOrigin, accessToken } = this.request.user
    const url = `https://${shopOrigin}/admin/api/${SHOPIFY_API_VERSION}/${path}`
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken }
    const response = await this.httpService.request({ method, headers, url, data }).toPromise()
    if (response.data.errors) {
      this.logger.error(JSON.stringify(response.data.errors))
      throw new InternalServerErrorException('Admin Rest API error.')
    }
    return response.data
  }
}
