import Honeybadger from '@honeybadger-io/js'
import { BaseExceptionFilter } from '@nestjs/core'
import { Catch, ArgumentsHost, HttpServer } from '@nestjs/common'

@Catch()
export class HoneybadgerExceptionsFilter extends BaseExceptionFilter {
  constructor(httpAdapter: HttpServer) {
    super(httpAdapter)
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    Honeybadger.setContext(request.user ? request.user.toObject() : undefined)
    Honeybadger.notify(exception)
    super.catch(exception, host)
  }
}
