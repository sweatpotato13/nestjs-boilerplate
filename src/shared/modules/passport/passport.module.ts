import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { GoogleOauthConfig } from "@src/config";

import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
    imports: [ConfigModule.forFeature(GoogleOauthConfig)],
    providers: [
        {
            provide: GoogleStrategy,
            useFactory: (config: ConfigType<typeof GoogleOauthConfig>) => {
                if (
                    !config.clientId ||
                    !config.clientSecret ||
                    !config.redirect
                ) {
                    return null;
                }
                return new GoogleStrategy(config);
            },
            inject: [GoogleOauthConfig.KEY]
        }
    ],
    controllers: []
})
export class PassportModule {}
