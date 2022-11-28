import { registerAs } from "@nestjs/config";
import { RedisOptions } from "ioredis";

export default registerAs("redis", (): RedisOptions => {
    const ret = {
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || "0"),
        lazyConnect: true,
        showFriendlyErrorStack: false,
        retryStrategy(times: number /* n 번째 재연결 */): number {
            const delay = times * 50 < 2000 ? times * 50 : 2000;
            return delay;
        }
    };
    if (process.env.REDIS_TLS) {
        return {
            tls: {
                host: process.env.REDIS_HOST || "127.0.0.1",
                port: parseInt(process.env.REDIS_PORT || "")
            },
            ...ret
        };
    } else {
        return {
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: parseInt(process.env.REDIS_PORT || ""),
            ...ret
        };
    }
});
