import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule } from "@nestjs/microservices";
import { KafkaConfg } from "@src/config";
import { KafkaConfigService } from "@src/config/modules/kafka/kafka.config.service";

import { KafkaService } from "./kafka.service";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule.forFeature(KafkaConfg)],
                name: "KAFKA",
                useClass: KafkaConfigService
            }
        ])
    ],
    providers: [KafkaService],
    controllers: []
})
export class KafkaModule {}
