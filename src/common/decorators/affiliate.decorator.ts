import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetAffiliate = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const affiliate = request.affiliate
  return data ? affiliate && affiliate[data] : affiliate
})
