import jwt from 'jsonwebtoken'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { Affiliate } from 'src/modules/affiliate/schema/affiliate.schema'
import { AffiliateService } from 'src/modules/affiliate/affiliate.service'
import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AffiliateGuard implements CanActivate {
  constructor(private readonly affiliateService: AffiliateService, private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request & { affiliate: Affiliate }
    const token = request.cookies.token
    const tokenIsValid = this.verifyToken(token)
    if (!tokenIsValid) return false
    const payload: any = jwt.decode(token)
    const userId = payload.sub
    const affiliate = await this.affiliateService.findById(userId)
    if (!affiliate) return false
    request.affiliate = affiliate
    return true
  }

  verifyToken(token: string): boolean {
    try {
      const secretKey = this.configService.get('AFFILIATE_AUTH_SECRET_KEY')
      jwt.verify(token, secretKey)
      return true
    } catch (e) {
      throw new UnauthorizedException(`Token verification failed: ${e}`)
    }
  }
}
