import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/orders.schema';
import { BILLING_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required()
      }),
      envFilePath: './apps/orders/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    // добавляем (регистрируем) новый модуль (микросервис) - биллинг сервис  
    RmqModule.register({ name: BILLING_SERVICE }),
    AuthModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
