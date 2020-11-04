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
    if (!requiredRoles) return true
    const req = context.switchToHttp().getRequest()
    let shopOrigin = null
    if (requiredRoles.includes(Role.Plugin) && req.headers['shop-origin']) {
      shopOrigin = req.headers['shop-origin']
    } else {
      const token = req.headers.authorization?.split(' ')[1]
      const verified = this.verify(token)
      if (!verified) return false
      const payload: any = jwt.decode(token)
      shopOrigin = parseUrl(payload.dest).resource
    }
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) return false
    req.user = user
    return requiredRoles.includes(Role.Plugin) || user.roles.some(role => requiredRoles.includes(role))
  }

  verify(token: string): boolean {
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
}
