import { Controller, Get, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { AppUrlService } from './app-url.service'

@Controller('app-url')
export class AppUrlController {
  constructor(private readonly appUrlService: AppUrlService) {}

  @Get()
  @UseGuards(EmbeddedAppGuard)
  find() {
    return this.appUrlService.find()
  }
}
