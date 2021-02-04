import { Client } from 'postmark'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Template } from './types/template'

export enum Persona {
  Ryan = 'Ryan from Bag <ryan@bag.supply>',
  Notifications = 'Bag <notifications@bag.supply>'
}

type MessageData = {
  to?: string
  from: Persona
  template: Template
  templateModel?: Record<string, any>
}

@Injectable()
export class MailService {
  private client: Client
  private replyTo = 'ryan@bag.supply'

  constructor(private readonly configService: ConfigService) {
    this.client = new Client(this.configService.get('POSTMARK_AUTH_TOKEN') as string)
  }

  sendWithTemplate(messageData: MessageData) {
    this.client.sendEmailWithTemplate({
      To: messageData.to,
      From: messageData.from,
      TemplateAlias: messageData.template,
      TemplateModel: messageData.templateModel || {},
      Tag: messageData.template,
      ReplyTo: this.replyTo
    })
  }
}
