import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { RmqService } from "@app/common";
import { RmqOptions } from "@nestjs/microservices";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true))
  // ack = true потому что мы не используем модель ивентов которые стучатся в сервис с просьбой сделать что то, а простой request-response
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get<ConfigService>(ConfigService)
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'))
}
bootstrap();
