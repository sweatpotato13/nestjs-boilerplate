import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule } from "@nestjs/microservices";
import { KafkaConfg } from "@src/config";
import { KafkaConfigService } from "@src/config/modules/kafka/kafka.config.service";

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
    providers: [],
    controllers: []
})
export class KafkaModule {}
