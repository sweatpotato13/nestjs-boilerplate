import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@src/shared/modules";
import { LoggerService, PrismaService } from "@src/shared/services";

import { UserController } from "./app/user.controller";
import { UserService } from "./app/user.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [CqrsModule, JwtModule],
    providers: [
        { provide: "PrismaService", useClass: PrismaService },
        { provide: "UserService", useClass: UserService },
        { provide: "LoggerService", useClass: LoggerService },
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
