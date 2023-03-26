import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtModuleConfig } from "@src/config";
import jwt, { Algorithm } from "jsonwebtoken";

@Injectable()
export class JwtService {
    public userJwtIndex = "activeJwtUsers";

    constructor(
        @Inject(JwtModuleConfig.KEY)
        private readonly _config: ConfigType<typeof JwtModuleConfig>,
    ) { }

    public async createUserJwt(userId: string): Promise<{ accessToken: string, refreshToken: string }> {
        this._config.refreshExpiresIn;
        this._config.accessExpiresIn;
        const accessTokenPayload = {
            userId,
            type: "accessToken"
        };
        const refreshTokenPayload = {
            userId,
            type: "refreshToken"
        };
        const accessToken = this.signJwt(accessTokenPayload, true);
        const refreshToken = this.signJwt(refreshTokenPayload, false);
        return { accessToken, refreshToken };
    }

    public signJwt(payload: object, isAccessToken: boolean): string {
        return jwt.sign(payload, this._config.privateKey, {
            algorithm: this._config.algorithm as Algorithm,
            expiresIn: isAccessToken ? this._config.accessExpiresIn : this._config.refreshExpiresIn
        });
    }

    public async decodeJwt(token: string): Promise<{ userId: string, type: string }> {
        return new Promise(resolve => {
            jwt.verify(
                token,
                this._config.publicKey,
                {
                    algorithms: [this._config.algorithm as Algorithm]
                },
                (err, decoded) => {
                    if (err) return resolve(null);
                    return resolve(decoded as { userId: string, type: string });
                }
            );
        });
    }
}
