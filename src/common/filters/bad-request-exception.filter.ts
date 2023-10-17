import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter
} from "@nestjs/common";
import { config } from "@src/config";
import { logger } from "@src/config/modules/winston";

@Catch(BadRequestException)
export class BadRequestExceptionFilter
    implements ExceptionFilter<BadRequestException>
{
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = exception.getStatus();

        logger.error(exception.getResponse());
        response.status(statusCode).json(
            config.isProduction
                ? {
                      statusCode,
                      timestamp: new Date().toISOString(),
                      message: "Parameter validation failed"
                  }
                : exception.getResponse()
        );
    }
}
