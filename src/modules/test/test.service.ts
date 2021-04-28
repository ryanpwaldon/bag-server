import { Timeout } from '@nestjs/schedule'
import { Injectable } from '@nestjs/common'
import { User } from 'src/modules/user/schema/user.schema'
import { UserService } from 'src/modules/user/user.service'
import { SalesService } from 'src/modules/sales/sales.service'

@Injectable()
export class TestService {
  constructor(private readonly salesService: SalesService, private readonly userService: UserService) {}

  // @Timeout(1000)
  async start() {
    try {
      const user = (await this.userService.findOne({ shopOrigin: 'bag-dev.myshopify.com' })) as User
      const monthlySalesRecord = await this.salesService.fetchMonthlySalesRecord(user)
      console.log(monthlySalesRecord)
    } catch (err) {
      console.log(err)
    }
  }
}
