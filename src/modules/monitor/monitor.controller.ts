import { Controller, Get } from '@nestjs/common'

@Controller('monitor')
export class MonitorController {
  @Get('status')
  status() {
    return
  }
}
