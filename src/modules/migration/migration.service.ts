import { Injectable } from '@nestjs/common'
import { OrderService } from 'src/modules/order/order.service'
import { ConversionService } from 'src/modules/conversion/conversion.service'

@Injectable()
export class MigrationService {
  constructor(private readonly orderService: OrderService, private readonly conversionService: ConversionService) {}

  async migrate() {
    // console.log('start')
    // try {
    //   const conversions = await this.conversionService.findAll()
    //   for (const conversion of conversions) {
    //     const data = {
    //       user: conversion.user,
    //       details: conversion.order as any,
    //       createdAt: (conversion as any).createdAt
    //     } as LeanDocument<Order>
    //     const order = await this.orderService.create(data)
    //     conversion.order = Types.ObjectId(order.id) as any
    //     await conversion.save()
    //   }
    //   console.log('finished')
    // } catch (err) {
    //   console.log(err)
    // }
  }
}
