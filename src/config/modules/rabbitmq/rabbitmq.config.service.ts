import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import {
    ClientProvider,
    ClientsModuleOptionsFactory,
    RmqOptions,
    Transport
} from "@nestjs/microservices";
import { RabbitMqConfig } from "@src/config";

@Injectable()
export class RabbitMqConfigService implements ClientsModuleOptionsFactory {
    constructor(
        @Inject(RabbitMqConfig.KEY)
        private config: ConfigType<typeof RabbitMqConfig>
    ) {}

    createClientOptions(): ClientProvider {
        const option: RmqOptions = {
            transport: Transport.RMQ,
            options: {
                urls: [
                    `amqp://${this.config.user}:${this.config.password}@${this.config.endpoint}`
                ],
                queue: this.config.queue,
                queueOptions: {
                    durable: false
                }
            }
        };
        return option;
    }
}
