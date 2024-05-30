import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    // импортируем биллинг сервис (биллинг модуль) которому можем посылать сообщения через .emit 
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
) {}
  
  
  async createOrder(request: CreateOrderRequest, authentication: string) {
    // транзакции позволяют нам быть уверенными что мы выполняем функционал - послать сообщение сервису биллинга - только когда бд выполнила транзакцию
    const session = await this.ordersRepository.startTransaction()
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication: authentication,
        })
      )
      await session.commitTransaction()
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }

  }

  async getOrders() {
    return this.ordersRepository.find({})
  }
}
