import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule, PassportModule } from "@src/shared/modules";
import { PrismaService } from "@src/shared/services/prisma.service";

import { AuthController } from "./app/auth.controller";
import { AuthService } from "./app/auth.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [PassportModule, CqrsModule, JwtModule],
    providers: [
        { provide: "AuthService", useClass: AuthService },
        { provide: "PrismaService", useClass: PrismaService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [AuthController]
})
export class AuthModule {
    configure() {}
}
