import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MonitorService {
  constructor(readonly configService: ConfigService) {}
}
