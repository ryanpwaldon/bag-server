import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import axios from 'axios'
import qs from 'qs'

@Injectable()
export class InstallationService {
  constructor(private configService: ConfigService) {}

  verifyOrigin(cookieState: string, requestState: string) {
    if (cookieState !== requestState) throw new ForbiddenException('Request origin validation failed.')
  }

  verifyHmac(hmac: string, data: any) {
    data = Object.assign({}, data)
    delete data.hmac
    const message = qs.stringify(data)
    const secret = this.configService.get('SHOPIFY_API_SECRET_KEY')
    const decryptedHmac = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex')
    if (decryptedHmac !== hmac) throw new BadRequestException('HMAC validation failed.')
  }

  async getAccessToken(shopOrigin: string, authCode: string) {
    const apiKey = this.configService.get('SHOPIFY_API_KEY')
    const apiSecret = this.configService.get('SHOPIFY_API_SECRET_KEY')
    const accessTokenRequestUrl = `https://${shopOrigin}/admin/oauth/access_token`
    const payload = { client_id: apiKey, client_secret: apiSecret, code: authCode }
    return (await axios({ method: 'post', url: accessTokenRequestUrl, data: payload })).data.access_token
  }
}
