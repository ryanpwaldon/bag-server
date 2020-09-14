import { Controller, All } from '@nestjs/common'

@Controller('gdpr')
export class GdprController {
  @All('customers/request')
  customersRequest() {
    return { statusCode: 200, message: 'Success' }
  }

  @All('customers/redact')
  customersRedact() {
    return { statusCode: 200, message: 'Success' }
  }

  @All('shop/redact')
  shopRedact() {
    return { statusCode: 200, message: 'Success' }
  }
}
