import { Controller, All } from '@nestjs/common'

@Controller('gdpr')
export class GdprController {
  @All('request-customers')
  requestCustomers() {
    return { statusCode: 200, message: 'Success' }
  }

  @All('delete-customers')
  deleteCustomers() {
    return { statusCode: 200, message: 'Success' }
  }

  @All('delete-shop')
  deleteShop() {
    return { statusCode: 200, message: 'Success' }
  }
}
