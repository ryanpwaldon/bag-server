import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../modules/user/user.service'
import { ConfigService } from '@nestjs/config'
import parseUrl from 'parse-url'
import jwt from 'jsonwebtoken'

@Injectable()
export class EmbeddedAppGuard implements CanActivate {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]
    const validToken = this.verifyToken(token)
    if (!validToken) return false
    const payload: any = jwt.decode(token)
    const shopOrigin = parseUrl(payload.dest).resource
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) return false
    request.user = user
    return true
  }

  verifyToken(token: string): boolean {
    try {
      const apiKey = this.configService.get('SHOPIFY_API_KEY')
      const secretKey = this.configService.get('SHOPIFY_API_SECRET_KEY')
      const payload: any = jwt.verify(token, secretKey)
      if (payload.aud !== apiKey) return false
      const issOrigin = parseUrl(payload.iss).resource
      const destOrigin = parseUrl(payload.dest).resource
      if (issOrigin !== destOrigin) return false
      return true
    } catch (e) {
      throw new UnauthorizedException(`Token verification failed: ${e}`)
    }
  }
}
