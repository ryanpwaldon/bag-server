import { ProductService } from './product.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('ids')
  @UseGuards(EmbeddedAppGuard)
  findByIds(@Query('ids') ids: string[] | undefined) {
    if (!ids?.length) return []
    return this.productService.findByIds(ids)
  }
}
