import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IncomingWebhook } from '@slack/webhook'

@Injectable()
export class SlackService {
  private readonly appEnv: string
  private readonly client: IncomingWebhook

  constructor(private readonly configService: ConfigService) {
    this.appEnv = this.configService.get('APP_ENV') as string
    const webhookUrl = this.configService.get('SLACK_WEBHOOK_URL') as string
    this.client = new IncomingWebhook(webhookUrl)
  }

  notify(text: string) {
    if (this.appEnv === 'production') {
      this.client.send({ text })
    }
  }
}
