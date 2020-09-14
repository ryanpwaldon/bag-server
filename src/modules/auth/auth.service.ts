import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import axios from 'axios'
import qs from 'qs'

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  verifyOrigin(cookieState, requestState) {
    if (cookieState !== requestState) {
      throw new ForbiddenException('Request origin validation failed.')
    }
  }

  verifyHmac(hmac, req) {
    const data = Object.assign({}, req.query)
    delete data.hmac
    const message = qs.stringify(data)
    const apiSecret = this.configService.get('SHOPIFY_API_SECRET_KEY')
    const generatedHmac = crypto
      .createHmac('sha256', apiSecret)
      .update(message)
      .digest('hex')
    if (generatedHmac !== hmac) throw new BadRequestException('HMAC validation failed.')
  }

  async requestAccessToken(shopDomain, code) {
    const apiKey = this.configService.get('SHOPIFY_API_KEY')
    const apiSecret = this.configService.get('SHOPIFY_API_SECRET_KEY')
    const accessTokenRequestUrl = `https://${shopDomain}/admin/oauth/access_token`
    const payload = { client_id: apiKey, client_secret: apiSecret, code }
    return (await axios({ method: 'post', url: accessTokenRequestUrl, data: payload })).data.access_token
  }
}
