import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Honeybadger from 'honeybadger'

@Injectable()
export class MonitorService {
  client = null

  constructor(readonly configService: ConfigService) {
    this.client = Honeybadger.configure({
      apiKey: configService.get('HONEYBADGER_API_KEY'),
      environment: configService.get('APP_ENV'),
      developmentEnvironments: ['development']
    })
  }
}
