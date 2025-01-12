import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@src/shared/modules";
import { LoggerService, PrismaService } from "@src/shared/services";

import { TemplateController } from "./app/template.controller";
import { TemplateService } from "./app/template.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [CqrsModule, JwtModule],
    providers: [
        { provide: "PrismaService", useClass: PrismaService },
        { provide: "TemplateService", useClass: TemplateService },
        { provide: "LoggerService", useClass: LoggerService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [TemplateController]
})
export class TemplateModule {
    configure(consumer: MiddlewareConsumer) {
        const {} = consumer;
    }
}
