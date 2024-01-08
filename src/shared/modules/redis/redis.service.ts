import { RedisModuleConfig } from "@config";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService extends Redis {
    constructor(
        @Inject(RedisModuleConfig.KEY)
        config: ConfigType<typeof RedisModuleConfig>
    ) {
        super(config);
    }

    public async count(key: string): Promise<number> {
        const allKeys = await this.keys(key);
        return allKeys.length;
    }

    public async existsKey(key: string): Promise<boolean> {
        return !!(await this.count(key));
    }

    public async getAllKeyValues(wildcard: string): Promise<any[]> {
        const keys = await this.keys(wildcard);
        return await Promise.all(
            keys.map(async key => {
                const value = await this.get(key);
                return { key, value };
            })
        );
    }
}
