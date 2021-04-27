import { User } from 'src/modules/user/schema/user.schema'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/common/decorators/user.decorator'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { AccessScopeService } from 'src/modules/access-scope/access-scope.service'
import { REQUIRED_ACCESS_SCOPES } from 'src/modules/access-scope/access-scope.constants'

@Controller('access-scope')
export class AccessScopeController {
  constructor(private readonly accessScopeService: AccessScopeService) {}

  @Get('status')
  @UseGuards(EmbeddedAppGuard)
  async checkStatus(@GetUser() user: User) {
    const accessScopes = await this.accessScopeService.find(user)
    const accessScopesUpToDate = REQUIRED_ACCESS_SCOPES.every(item => accessScopes.includes(item))
    return accessScopesUpToDate
  }
}
