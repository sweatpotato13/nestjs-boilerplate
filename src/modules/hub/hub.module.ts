import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Hub } from "@src/shared/entities";
import { HubRepository } from "@src/shared/repositories/hub.repository";
import { HubController } from "./app/hub.controller";
import { HubService } from "./app/hub.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([HubRepository]),
        TypeOrmModule.forFeature([Hub]),
        HubRepository
    ],
    providers: [
        { provide: "HubService", useClass: HubService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [HubController]
})
export class HubModule {
    configure(consumer: MiddlewareConsumer) {}
}
