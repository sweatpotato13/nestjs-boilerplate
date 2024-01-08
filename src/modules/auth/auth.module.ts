import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoogleOauthConfig } from "@src/config";
import { App, Role, User, UserRole } from "@src/shared/entities";
import { JwtModule } from "@src/shared/modules";

import { AuthController } from "./app/auth.controller";
import { AuthService } from "./app/auth.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";
import { GoogleStrategy } from "./infrastructures/google.strategy";

@Module({
    imports: [
        ConfigModule.forFeature(GoogleOauthConfig),
        TypeOrmModule.forFeature([User, Role, UserRole, App]),
        CqrsModule,
        JwtModule
    ],
    providers: [
        { provide: "AuthService", useClass: AuthService },
        GoogleStrategy,
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [AuthController]
})
export class AuthModule {
    configure() {}
}
