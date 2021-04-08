import { Controller, Get } from "@nestjs/common";
import { LoggerService } from "@shared/modules/logger/logger.service";

import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly _logger: LoggerService
    ) {}

    @Get()
    getHello(): string {
        const result = this.appService.getHello();
        if (result) {
            this._logger.error("error", {
                context: "this is error",
            });
            this._logger.info("info", {
                context: "this is info",
            });
        }
        return result;
    }
}
