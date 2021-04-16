import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ILoggerService } from "@shared/interfaces/logger.interface";
import { AsyncLocalStorageService } from "@shared/modules/async-local-storage/async-local-storage.service";
import { LoggerModuleConfig } from "@src/config";
import { createLogger, Logger } from "winston";

@Injectable()
export class LoggerService implements ILoggerService {
    private readonly logger: Logger;

    constructor(
        @Inject(LoggerModuleConfig.KEY)
        _config: ConfigType<typeof LoggerModuleConfig>,
        private readonly _asyncLocalStorage: AsyncLocalStorageService
    ) {
        this.logger = createLogger(_config);
    }

    info(message: string, meta?: Record<string, any>) {
        if (!meta) meta = {};
        const store = this._asyncLocalStorage?.getStore();
        if (store) {
            meta.requestId = store.requestId;
        }
        this.logger.info(message, { meta });
    }

    error(message: string, meta?: Record<string, any>) {
        if (!meta) meta = {};
        const store = this._asyncLocalStorage?.getStore();
        if (store) {
            meta.requestId = store.requestId;
        }
        this.logger.error(message, { meta });
    }

    log(level: string, message: string, meta?: Record<string, any>) {
        if (!meta) meta = {};
        const store = this._asyncLocalStorage?.getStore();
        if (store) {
            meta.requestId = store.requestId;
        }
        this.logger.log(level, message, { meta });
    }

    warn(message: string, meta?: Record<string, any>) {
        if (!meta) meta = {};
        const store = this._asyncLocalStorage?.getStore();
        if (store) {
            meta.requestId = store.requestId;
        }
        this.logger.warn(message, { meta });
    }

    debug(message: string, meta?: Record<string, any>) {
        if (!meta) meta = {};
        const store = this._asyncLocalStorage?.getStore();
        if (store) {
            meta.requestId = store.requestId;
        }
        this.logger.debug(message, { meta });
    }

    errorStream = {
        write: (message: string): void => {
            this.error(message);
        },
    };
}
