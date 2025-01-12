import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule, PassportModule } from "@src/shared/modules";
import { LoggerService, PrismaService } from "@src/shared/services";

import { AuthController } from "./app/auth.controller";
import { AuthService } from "./app/auth.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [PassportModule, CqrsModule, JwtModule],
    providers: [
        { provide: "AuthService", useClass: AuthService },
        { provide: "PrismaService", useClass: PrismaService },
        { provide: "LoggerService", useClass: LoggerService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [AuthController]
})
export class AuthModule {
    configure() {}
}
