import { Client } from 'postmark'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Templates, getTemplateByName } from 'src/modules/mail/constants/templates'

type Message = {
  to: string
  name: keyof Templates
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

  sendWithTemplate({ to, name, model = {} }: Message) {
    this.client.sendEmailWithTemplate({
      To: to,
      From: `${this.fromName} <${this.fromAddress}>`,
      TemplateId: getTemplateByName(name),
      TemplateModel: model,
      Tag: name
    })
  }
}
