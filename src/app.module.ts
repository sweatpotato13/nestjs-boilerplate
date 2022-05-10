import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { TypeOrmModuleConfig } from "@config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";

import { BadRequestExceptionFilter } from "./common/filters/bad-request-exception.filter";
import { TypeOrmConfigService } from "./config/modules/typeorm/typeorm.config.service";
import { UserModule } from "./modules/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(TypeOrmModuleConfig)],
            useClass: TypeOrmConfigService
        }),
        /** ------------------ */
        UserModule
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
