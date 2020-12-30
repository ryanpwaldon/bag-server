import { ExecutionContext, Injectable, CanActivate, BadRequestException, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import crypto from 'crypto'
import qs from 'qs'

@Injectable()
export class ShopifyInstallationGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest()
    const hmac = req.query.hmac as string
    const authCode = req.query.code as string
    const shopOrigin = req.query.shop as string
    const requestState = req.query.state as string
    const cookieState = req.cookies.state as string
    if (!authCode) throw new BadRequestException('Missing auth code.')
    if (!shopOrigin) throw new BadRequestException('Missing shop origin.')
    this.verifyOrigin(cookieState, requestState)
    this.verifyHmac(hmac, req.query)
    return true
  }

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
}
