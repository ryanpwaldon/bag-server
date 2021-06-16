import { Logger } from 'nestjs-pino'
import { User } from 'src/modules/user/schema/user.schema'
import { SHOPIFY_ADMIN_API_VERSION } from 'src/common/constants'
import { Injectable, HttpService, InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class AdminService {
  constructor(private readonly logger: Logger, private readonly httpService: HttpService) {}

  async createGraphQLRequest({ shopOrigin, accessToken }: User, data: any) {
    const method = 'post'
    const url = `https://${shopOrigin}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken }
    const response = await this.httpService.request({ method, headers, url, data }).toPromise()
    if (response.data.errors) {
      this.logger.error(JSON.stringify(response.data.errors))
      throw new InternalServerErrorException('Admin GraphQL API error.')
    }
    return response.data
  }

  async createRestRequest({ shopOrigin, accessToken }: User, method: 'post' | 'get' | 'put', path: string, data?: any) {
    const url = `https://${shopOrigin}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/${path}`
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken }
    const response = await this.httpService.request({ method, headers, url, data }).toPromise()
    if (response.data.errors) {
      this.logger.error(JSON.stringify(response.data.errors))
      throw new InternalServerErrorException('Admin Rest API error.')
    }
    return response.data
  }
}
