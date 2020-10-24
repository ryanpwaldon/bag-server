import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common'
import { UserService } from '../../modules/user/user.service'
import { Role } from '../constants/role.constants'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import parseUrl from 'parse-url'
import jwt from 'jsonwebtoken'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles: Role[] = this.reflector.get('roles', context.getHandler())
    const req = context.switchToHttp().getRequest()
    const token = req.headers.authorization.split(' ')[1]
    const verified = this.verify(token)
    if (!verified) return requiredRoles ? false : true
    const shopOrigin = this.extractShopOrigin(token)
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) return false
    req.user = user
    return requiredRoles ? user.roles.some(role => requiredRoles.includes(role)) : true
  }

  verify(token): boolean {
    try {
      const apiKey = this.configService.get('SHOPIFY_API_KEY')
      const secretKey = this.configService.get('SHOPIFY_API_SECRET_KEY')
      const payload: any = jwt.verify(token, secretKey)
      if (payload.aud !== apiKey) return false
      const issOrigin = parseUrl(payload.iss).resource
      const destOrigin = parseUrl(payload.dest).resource
      if (issOrigin !== destOrigin) return false
      return true
    } catch {
      return false
    }
  }

  extractShopOrigin(token) {
    const payload: any = jwt.decode(token)
    return parseUrl(payload.dest).resource
  }
}
