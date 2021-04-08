import { LoggerModuleConfig } from "@config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { LoggerService } from "./logger.service";

@Module({
    imports: [ConfigModule.forFeature(LoggerModuleConfig)],
    providers: [
        {
            provide: "LoggerService",
            useClass: LoggerService,
        },
    ],
    exports: ["LoggerService"],
})
export class LoggerModule {}
