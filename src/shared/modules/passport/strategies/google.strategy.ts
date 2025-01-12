import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { GoogleOauthConfig } from "@src/config";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(
        @Inject(GoogleOauthConfig.KEY)
        private readonly config: ConfigType<typeof GoogleOauthConfig>
    ) {
        super({
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            callbackURL: config.redirect,
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

        if (!emails?.[0]?.value) {
            throw new Error("Email not provided from Google");
        }

        const user = {
            provider: "google",
            providerId: id,
            email: emails[0].value,
            name: profile._json.name
        };

        done(null, user);
    }
}
