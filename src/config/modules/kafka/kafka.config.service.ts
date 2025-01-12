import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import {
    ClientProvider,
    ClientsModuleOptionsFactory,
    KafkaOptions,
    Transport
} from "@nestjs/microservices";
import { KafkaConfg } from "@src/config";

@Injectable()
export class KafkaConfigService implements ClientsModuleOptionsFactory {
    constructor(
        @Inject(KafkaConfg.KEY)
        private config: ConfigType<typeof KafkaConfg>
    ) {}

    createClientOptions(): ClientProvider {
        const option: KafkaOptions = {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: this.config.clientId,
                    brokers: [this.config.brokerEndpoint]
                },
                consumer: {
                    groupId: this.config.groupId
                }
            }
        };
        return option;
    }
}
