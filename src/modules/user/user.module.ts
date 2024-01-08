import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ClientsModule } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ElasticsearchConfig, RabbitMqConfig } from "@src/config";
import { ElasticsearchConfigService } from "@src/config/modules/elasticsearch/elasticsearch.config.service";
import { RabbitMqConfigService } from "@src/config/modules/rabbitmq/rabbitmq.config.service";
import { App, Role, User, UserRole } from "@src/shared/entities";
import { JwtModule } from "@src/shared/modules";

import { UserController } from "./app/user.controller";
import { UserService } from "./app/user.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([User, Role, UserRole, App]),
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule.forFeature(ElasticsearchConfig)],
            useClass: ElasticsearchConfigService
        }),
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule.forFeature(RabbitMqConfig)],
                name: "RABBITMQ",
                useClass: RabbitMqConfigService
            }
        ]),
        JwtModule
    ],
    providers: [
        { provide: "UserService", useClass: UserService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [UserController]
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        const {} = consumer;
    }
}
