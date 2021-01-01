import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MonitorService {
  constructor(readonly configService: ConfigService) {
    // Honeybadger.configure({
    //   apiKey: configService.get('HONEYBADGER_API_KEY') as string,
    //   environment: configService.get('APP_ENV'),
    //   developmentEnvironments: ['development']
    // })
  }
}
