import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HubRepository } from "@src/shared/repositories/hub.repository";
import { HubController } from "./app/hub.controller";
import { HubService } from "./app/hub.service";
import { CommandHandlers } from "./domain/commands/handlers";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([HubRepository]),
        HubRepository
    ],
    providers: [
        { provide: "HubService", useClass: HubService },
        ...CommandHandlers
    ],
    controllers: [HubController]
})
export class HubModule {
    configure(consumer: MiddlewareConsumer) {}
}
