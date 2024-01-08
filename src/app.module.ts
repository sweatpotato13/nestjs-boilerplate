import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { TypeOrmModuleConfig } from "@config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";

import { BadRequestExceptionFilter } from "./common/filters/bad-request-exception.filter";
import { TypeOrmConfigService } from "./config/modules/typeorm/typeorm.config.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(TypeOrmModuleConfig)],
            useClass: TypeOrmConfigService
        }),
        /** ------------------ */
        UserModule,
        AuthModule
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
    constructor(private dataSource: DataSource) {
        addTransactionalDataSource(dataSource);
    }
}
