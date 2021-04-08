import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AsyncLocalStorageModule } from "@shared/modules/async-local-storage/async-local-storage.module";
import { LoggerModule } from "@shared/modules/logger/logger.module";
import { AppController } from "@src/app.controller";
import { AppService } from "@src/app.service";

@Module({
    imports: [AsyncLocalStorageModule, LoggerModule],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        AppService,
    ],
})
export class AppModule {}
