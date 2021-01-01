import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common'
import { UserService } from '../../modules/user/user.service'

@Injectable()
export class PluginGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const shopOrigin = request.headers['shop-origin']
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) return false
    request.user = user
    return true
  }
}
