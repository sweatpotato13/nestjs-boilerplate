import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { TypeOrmModuleConfig } from "@config";
import { HubModule } from "./modules/hub/hub.module";
import { BadRequestExceptionFilter } from "./common/filters/bad-request-exception.filter";
import { TypeOrmConfigService } from "./config/modules/typeorm/typeorm.config.service";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(TypeOrmModuleConfig)],
            useClass: TypeOrmConfigService
        }),
        /** ------------------ */
        HubModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        },
        {
            provide: APP_FILTER,
            useClass: BadRequestExceptionFilter
        }
    ]
})
export class AppModule {
    constructor(private connection: Connection) {}
}
