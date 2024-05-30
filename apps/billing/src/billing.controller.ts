import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard, RmqService } from '@app/common';

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService, private readonly rmqService: RmqService) {}

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }
  
  // контроллер может принимать не только запросы, но и как в этом случае - сообщения от других сервисов (от сервиса orders)
  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.billingService.bill(data)
    // только если строчка сверху выполнилась, даем знать об этом RabbitMQ что бы он убрал сообщение из очереди
    this.rmqService.ack(context)
    
  }
}
