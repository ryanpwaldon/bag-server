import { Controller, Get, UseGuards } from '@nestjs/common'
import { Role } from 'src/common/constants/role.constants'
import { Roles } from 'src/common/decorators/role.decorator'
import { RoleGuard } from 'src/common/guards/role.guard'
import { REQUIRED_ACCESS_SCOPES } from 'src/modules/access-scope/access-scope.constants'
import { AccessScopeService } from 'src/modules/access-scope/access-scope.service'

@Controller('access-scope')
export class AccessScopeController {
  constructor(private readonly accessScopeService: AccessScopeService) {}

  @Get('status')
  @UseGuards(RoleGuard)
  @Roles(Role.Installed)
  async checkStatus() {
    const accessScopes = await this.accessScopeService.find()
    const accessScopesUpToDate = REQUIRED_ACCESS_SCOPES.every(item => accessScopes.includes(item))
    return accessScopesUpToDate
  }
}
