import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtModuleConfig } from "@src/config";
import { User } from "@src/shared/entities/user.entity";
import { UserRole } from "@src/shared/entities/user-role.entity";
import { NotFoundException } from "@src/shared/models/error/http.error";
import { encode } from "bs58";
import { randomBytes } from "crypto";
import jwt, { Algorithm } from "jsonwebtoken";
import { getManager } from "typeorm";

import { RedisService } from "../redis/redis.service";

@Injectable()
export class JwtService {
    public userJwtIndex = "activeJwtUsers";

    constructor(
        @Inject(JwtModuleConfig.KEY)
        private readonly _config: ConfigType<typeof JwtModuleConfig>,
        @Inject("RedisService") private readonly _redis: RedisService
    ) { }

    public async updateAuthMsg(account: string): Promise<string> {
        const authMsg = randomBytes(16).toString("hex");
        await this._redis.set(`authMsg:${account}`, authMsg, "EX", 86400);
        return authMsg;
    }

    public async signUp(input: {
        account: string;
        userId: string;
    }): Promise<string | null> {
        const { account, userId } = input;

        const authMsg = await this.updateAuthMsg(account);

        if (!authMsg) {
            throw new NotFoundException(`Can not found auth message`, {
                context: `JwtService`,
            });
        }

        return this.signJwt({ userId: userId });
    }

    public signJwt(claims: { userId: string }): string {
        return jwt.sign(claims, this._config.privateKey, {
            algorithm: this._config.algorithm as Algorithm,
            expiresIn: this._config.accessExpiresIn,
        });
    }

    public async decodeJwt(token: string): Promise<{ userId: string }> {
        return new Promise(resolve => {
            jwt.verify(
                token,
                this._config.publicKey,
                {
                    algorithms: [this._config.algorithm as Algorithm],
                },
                (err, decoded) => {
                    if (err) return resolve(null);
                    return resolve(decoded as { userId: string });
                }
            );
        });
    }

    public async getUserRoles(userId: string): Promise<string[]> {
        const userRole = await getManager().find(UserRole, { userId });

        return userRole.map(cur => {
            return cur.role.name;
        });
    }

    public async checkUserId(userId: string): Promise<boolean> {
        return !!(await getManager().findOne(User, userId));
    }

    public async checkUserByAccount(account: string): Promise<boolean> {
        return !!(await getManager().findOne(User, { account }));
    }

    public async getUserId(account: string): Promise<string> {
        const { id } = await getManager().findOne(User, { account });

        return id;
    }

    public createRefreshToken(): string {
        return encode(randomBytes(32));
    }

    private constructUserKey(userId: string, refreshToken: string): string {
        return `${this.userJwtIndex}:${userId}:${refreshToken}`;
    }

    public async registerToken(
        userId: string,
        refreshToken: string,
        token: string
    ): Promise<any> {
        return await this._redis.set(
            this.constructUserKey(userId, refreshToken),
            token,
            "EX",
            this._config.refreshExpiresIn
        );
    }

    public async getTokens(userId: string): Promise<string[]> {
        const keyValues = await this._redis.getAllKeyValues(
            `*${this.userJwtIndex}.${userId}`
        );
        return keyValues.map(keyValue => keyValue.value);
    }

    public async deAuthenticateUser(userId: string): Promise<void> {
        await this.clearAllSessions(userId);
    }

    public async refreshTokenExists(refreshToken: string): Promise<boolean> {
        return await this._redis.existsKey(`*${refreshToken}*`);
    }

    public async getUserAccountFromRefreshToken(
        refreshToken: string
    ): Promise<string> {
        const keys = await this._redis.keys(`*:${refreshToken}`);
        const exists = !!keys.length;

        if (!exists)
            throw new NotFoundException(
                "User account not found for refresh token",
                { context: "JwtService" }
            );

        const key = keys[0];

        return key.substring(
            key.indexOf(this.userJwtIndex) + this.userJwtIndex.length + 1
        );
    }

    public async clearAllTokens(): Promise<any> {
        const allKeys = await this._redis.keys(`*${this.userJwtIndex}*`);
        return Promise.all(
            allKeys.map(async key => await this._redis.del(key))
        );
    }

    public async countTokens(): Promise<number> {
        return (await this._redis.keys(`*${this.userJwtIndex}*`)).length;
    }

    public async getToken(
        userId: string,
        refreshToken: string
    ): Promise<string | null> {
        return await this._redis.get(
            this.constructUserKey(userId, refreshToken)
        );
    }

    public async clearToken(
        userId: string,
        refreshToken: string
    ): Promise<any> {
        return await this._redis.del(
            this.constructUserKey(userId, refreshToken)
        );
    }

    public async countSessions(userId: string): Promise<number> {
        return (await this._redis.keys(`*${this.userJwtIndex}:${userId}`))
            .length;
    }

    public async clearAllSessions(userId: string): Promise<any> {
        const keyValues = await this._redis.getAllKeyValues(
            `*${this.userJwtIndex}:${userId}*`
        );
        const keys = keyValues.map(keyValue => keyValue.key);
        return await Promise.all(
            keys.map(async key => await this._redis.del(key))
        );
    }

    public async sessionExists(
        userId: string,
        refreshToken: string
    ): Promise<boolean> {
        const token = await this.getToken(userId, refreshToken);
        return !!token;
    }
}
