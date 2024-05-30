import { DynamicModule, Module } from "@nestjs/common";
import { RmqService } from "./rmq.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

interface RmqModuleOprions {
    name: string;
}

@Module({
    providers: [RmqService],
    exports: [RmqService]
})
// создаем функцию для генерации динамического модуля, который можно использовать для коммуникации между приложениями 

export class RmqModule {
    static register({ name }: RmqModuleOprions): DynamicModule {
        return {
            module: RmqModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name,
                        useFactory: (configService: ConfigService) => ({
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBIT_MQ_URI')],
                                // здесь создается модуль в зависимости от названия сервиса с которым нужно общаться
                                queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                            }
                        }),
                        inject: [ConfigService],
                    }
                ])
            ],
            exports: [ClientsModule]
        }
    }
}