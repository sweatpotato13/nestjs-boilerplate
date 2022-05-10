import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { App,Role, User, UserRole } from "@src/shared/entities";

import { UserController } from "./app/user.controller";
import { UserService } from "./app/user.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([User, Role, UserRole, App]),
    ],
    providers: [
        { provide: "UserService", useClass: UserService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [UserController]
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {}
}
