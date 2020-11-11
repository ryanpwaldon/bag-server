import { Body, Controller, Get } from '@nestjs/common'

@Controller('order')
export class OrderController {
  @Get('event/created')
  onCreated(@Body() body: any) {
    console.log(body)
  }
}
