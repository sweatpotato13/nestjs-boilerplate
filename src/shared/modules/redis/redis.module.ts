import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisService } from "./redis.service";
import { RedisModuleConfig } from "@config";

@Module({
    imports: [ConfigModule.forFeature(RedisModuleConfig)],
    providers: [
        {
            provide: "RedisService",
            useClass: RedisService,
        },
    ],
    exports: ["RedisService"],
})
export class RedisModule { }