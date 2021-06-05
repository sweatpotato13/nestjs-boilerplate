import Container from "typedi";
import { LoggerService } from "../../services";

export class SuccessResponse {
    private success = true;
    private message = "";
    private params: any;

    constructor(message?: string, params?: any) {
        if (message) this.message = message;
        if (params) this.params = params;
        this.logInfo();
    }

    private logInfo() {
        const logger: LoggerService = Container.get(LoggerService);
        logger.info(this.message || "", {
            params: this.params
        });
    }
}
