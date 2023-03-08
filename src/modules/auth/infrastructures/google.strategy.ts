import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { GoogleOauthConfig } from "@src/config";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

import { AuthService } from "../app/auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(
        @Inject(GoogleOauthConfig.KEY)
        private readonly _config: ConfigType<typeof GoogleOauthConfig>,
        @Inject("AuthService") private readonly _service: AuthService
    ) {
        super({
            clientID: _config.clientId,
            clientSecret: _config.clientSecret,
            callbackURL: _config.redirect,
            scope: ["email", "profile"]
        });
    }

    validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ) {
        const { id, emails } = profile;

        const user = {
            provider: "google",
            providerId: id,
            email: emails[0].value,
            name: profile._json.name
        };

        done(null, user);
    }
}
