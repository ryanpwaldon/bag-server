import { Client } from 'postmark'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Template } from './types/template'

type Message = {
  to: string
  template: Template
  model?: Record<string, any>
}

@Injectable()
export class MailService {
  private client: Client
  private fromAddress = 'ryan@bag.supply'
  private fromName = 'Ryan from Bag'

  constructor(private readonly configService: ConfigService) {
    this.client = new Client(this.configService.get('POSTMARK_AUTH_TOKEN') as string)
  }

  sendWithTemplate({ to, template, model = {} }: Message) {
    this.client.sendEmailWithTemplate({
      To: to,
      From: `${this.fromName} <${this.fromAddress}>`,
      TemplateAlias: template,
      TemplateModel: model,
      Tag: template
    })
  }
}
