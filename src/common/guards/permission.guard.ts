import { Permission } from 'src/modules/user/user.types'
import { CanActivate, ExecutionContext, mixin } from '@nestjs/common'

export const PermissionGuard = (permission: Permission) => {
  class PermissionGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const user = context.switchToHttp().getRequest().user
      return user.permissions.includes(permission)
    }
  }

  const guard = mixin(PermissionGuardMixin)
  return guard
}
