import { HttpService, Injectable } from '@nestjs/common'

@Injectable()
export class PartnerService {
  constructor(private readonly httpService: HttpService) {}

  async request(data: { query: string }) {
    return (await this.httpService.request({ method: 'post', data }).toPromise()).data
  }
}
