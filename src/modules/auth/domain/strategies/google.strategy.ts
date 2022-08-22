import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { GoogleOauthConfig } from '@src/config';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @Inject(GoogleOauthConfig.KEY)
        private readonly _config: ConfigType<typeof GoogleOauthConfig>,

    ) {
        super({
            clientID: _config.clientId,
            clientSecret: _config.clientSecret,
            callbackURL: _config.redirect,
            scope: ['email', 'profile'],
        });
    }

    validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        const { id, name, emails } = profile;

        return {
            provider: 'google',
            providerId: id,
            name: name.givenName,
            email: emails[0].value,
        };
    }
}
