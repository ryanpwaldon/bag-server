import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common'
import { UserService } from '../../modules/user/user.service'

@Injectable()
export class ShopifyWebhookGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const shopOrigin = req.headers['x-shopify-shop-domain']
    if (!shopOrigin) return false
    const user = await this.userService.findOne({ shopOrigin })
    if (!user) return false
    req.user = user
    return true
  }
}
