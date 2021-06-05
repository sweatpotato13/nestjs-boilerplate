import { CONTEXT, ResponseTypes, ErrorCodes } from "../../constants/index";
import { LoggerService } from "../../services/logger.service";
import Container from "typedi";

export class ErrorResponse {
    private developer_message = "";
    private "@type": string = ResponseTypes.ERROR_RESPONSE;
    private "@context": string = CONTEXT;
    private error_code: ErrorCodes | number;
    private params: any;

    constructor(
        message?: string,
        errorCode?: ErrorCodes | number,
        params?: any
    ) {
        this["@context"];
        this["@type"];
        if (message) this.developer_message = message;
        if (errorCode) this.error_code = errorCode;
        if (params) this.params = params;
        this.logError();
    }

    private logError() {
        const logger: LoggerService = Container.get(LoggerService);
        logger.error(this.developer_message || "", {
            code: this.error_code,
            params: this.params
        });
    }
}
