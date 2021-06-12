import jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { AffiliateService } from 'src/modules/affiliate/affiliate.service'
import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AffiliateGuard implements CanActivate {
  constructor(private readonly affiliateService: AffiliateService, private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const sessionToken = request.cookies.sessionToken
    const sessionTokenIsValid = this.verifyToken(sessionToken)
    if (!sessionTokenIsValid) return false
    const payload: any = jwt.decode(sessionToken)
    const affiliateId = payload.sub
    const affiliate = await this.affiliateService.findById(affiliateId)
    if (!affiliate) return false
    request.affiliate = affiliate
    return true
  }

  verifyToken(token: string): boolean {
    try {
      const secretKey = this.configService.get('SESSION_SECRET_KEY')
      jwt.verify(token, secretKey)
      return true
    } catch (e) {
      throw new UnauthorizedException(`Token verification failed: ${e}`)
    }
  }
}
