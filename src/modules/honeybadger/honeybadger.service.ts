import { Injectable } from '@nestjs/common'
import Honeybadger from '@honeybadger-io/js'

@Injectable()
export class HoneybadgerService {
  notify(exception: any) {
    Honeybadger.notify(exception)
  }
}
