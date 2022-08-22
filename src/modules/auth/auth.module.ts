import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GoogleOauthConfig } from "@src/config";

import { AuthController } from "./app/auth.controller";
import { AuthService } from "./app/auth.service";
import { GoogleStrategy } from "./domain/strategies/google.strategy";


@Module({
    imports: [
        ConfigModule.forFeature(GoogleOauthConfig),
        // CqrsModule,
    ],
    providers: [
        { provide: "AuthService", useClass: AuthService },
        GoogleStrategy
        // ...CommandHandlers,
        // ...QueryHandlers
    ],
    controllers: [AuthController]
})
export class AuthModule {
    configure() { }
}
