import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { GoogleOauthConfig } from "@src/config";
import { JwtModule } from "@src/shared/modules";
import { PrismaService } from "@src/shared/services/prisma.service";

import { AuthController } from "./app/auth.controller";
import { AuthService } from "./app/auth.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";
import { GoogleStrategy } from "./infrastructures/google.strategy";

@Module({
    imports: [
        ConfigModule.forFeature(GoogleOauthConfig),
        CqrsModule,
        JwtModule
    ],
    providers: [
        { provide: "AuthService", useClass: AuthService },
        { provide: "PrismaService", useClass: PrismaService },
        {
            provide: GoogleStrategy,
            useFactory: (
                config: ConfigType<typeof GoogleOauthConfig>,
                service: AuthService
            ) => {
                if (
                    !config.clientId ||
                    !config.clientSecret ||
                    !config.redirect
                ) {
                    return null;
                }
                return new GoogleStrategy(config, service);
            },
            inject: [GoogleOauthConfig.KEY, "AuthService"]
        },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [AuthController]
})
export class AuthModule {
    configure() {}
}
