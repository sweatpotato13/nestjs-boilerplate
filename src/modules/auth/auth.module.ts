import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { GoogleOauthConfig } from "@src/config";

import { AuthController } from "./app/auth.controller";
import { AuthService } from "./app/auth.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { GoogleStrategy } from "./domain/infrastructures/google.strategy";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [ConfigModule.forFeature(GoogleOauthConfig), CqrsModule],
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
