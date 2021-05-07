import { Injectable } from '@nestjs/common'
import { UserService } from 'src/modules/user/user.service'
import { SalesService } from 'src/modules/sales/sales.service'
import { SubscriptionService } from 'src/modules/subscription/subscription.service'

@Injectable()
export class TestService {
  constructor(
    private readonly userService: UserService,
    private readonly salesService: SalesService,
    private readonly subscriptionService: SubscriptionService
  ) {}
}
