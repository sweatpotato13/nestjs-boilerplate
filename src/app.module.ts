import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";

import { AppController } from "./app.controller";
import { BadRequestExceptionFilter } from "./common/filters/bad-request-exception.filter";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";

@Module({
    imports: [
        /** ------------------ */
        UserModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        },
        {
            provide: APP_FILTER,
            useClass: BadRequestExceptionFilter
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {
    constructor() {}
}
