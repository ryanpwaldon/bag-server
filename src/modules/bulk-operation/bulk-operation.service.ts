import moment from 'moment'
import { User } from 'src/modules/user/schema/user.schema'
import { AdminService } from 'src/modules/admin/admin.service'
import { HttpService, Injectable, InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class BulkOperationService {
  constructor(private readonly httpService: HttpService, private readonly adminService: AdminService) {}

  async performBulkOperation(user: User, query: string): Promise<NodeJS.ReadableStream> {
    let url = null
    let status = 'RUNNING'
    let createdAt = null
    let completedAt = null
    let fileSize = null
    const bulkOperationId = await this.createBulkOperation(user, query)
    while (status === 'RUNNING') {
      await new Promise(resolve => setTimeout(resolve, 5000))
      ;({ status, url, createdAt, completedAt, fileSize } = await this.pollBulkOperation(user, bulkOperationId))
    }
    if (status !== 'COMPLETED') throw new InternalServerErrorException('Bulk operation faled.')
    console.log(`Bulk operation file size: ${fileSize}`)
    console.log(`Bulk operation duration: ${moment(completedAt).diff(moment(createdAt))}`)
    const bulkOperationResponse = await this.httpService
      .request({ method: 'GET', url, responseType: 'stream' })
      .toPromise()
    return bulkOperationResponse.data
  }

  async createBulkOperation(user: User, query: string) {
    const { data } = await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        mutation {
          bulkOperationRunQuery(query: """${query}""") {
            bulkOperation {
              id
            }
          }
        }
      `
    })
    return data.bulkOperationRunQuery.bulkOperation.id
  }

  async pollBulkOperation(user: User, id: string) {
    const { data } = await this.adminService.createGraphQLRequest(user, {
      query: /* GraphQL */ `
        {
          node(id: "${id}") {
            ... on BulkOperation {
              status
              createdAt
              completedAt
              fileSize
              url
            }
          }
        }
      `
    })
    return data.node
  }
}
