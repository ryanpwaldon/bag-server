import { CanActivate, ExecutionContext, mixin } from '@nestjs/common'

export const PermissionGuard = (permission: string) => {
  class PermissionGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const user = context.switchToHttp().getRequest().user
      return user.permissions.includes(permission)
    }
  }

  const guard = mixin(PermissionGuardMixin)
  return guard
}
