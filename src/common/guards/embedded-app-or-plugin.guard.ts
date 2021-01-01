import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common'
import { EmbeddedAppGuard } from 'src/common/guards/embedded-app.guard'
import { PluginGuard } from 'src/common/guards/plugin.guard'

@Injectable()
export class EmbeddedAppOrPluginGuard implements CanActivate {
  constructor(private readonly embeddedAppGuard: EmbeddedAppGuard, private readonly pluginGuard: PluginGuard) {}

  async canActivate(context: ExecutionContext) {
    return (await this.embeddedAppGuard.canActivate(context)) || (await this.pluginGuard.canActivate(context))
  }
}
