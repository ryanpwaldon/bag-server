import { Controller, Get, UseGuards } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { AccessScopeService } from 'src/modules/access-scope/access-scope.service'
import { REQUIRED_ACCESS_SCOPES } from 'src/modules/access-scope/access-scope.constants'

@Controller('access-scope')
export class AccessScopeController {
  constructor(private readonly accessScopeService: AccessScopeService) {}

  @Get('status')
  @UseGuards(EmbeddedAppGuard)
  async checkStatus() {
    const accessScopes = await this.accessScopeService.find()
    const accessScopesUpToDate = REQUIRED_ACCESS_SCOPES.every(item => accessScopes.includes(item))
    return accessScopesUpToDate
  }
}
