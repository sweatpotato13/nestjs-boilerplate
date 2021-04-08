import { Global, Module } from "@nestjs/common";

import { AsyncLocalStorageService } from "./async-local-storage.service";

@Global()
@Module({
    providers: [
        {
            provide: "AsyncLocalStorageService",
            useClass: AsyncLocalStorageService,
        },
    ],
    exports: ["AsyncLocalStorageService"],
})
export class AsyncLocalStorageModule {}
