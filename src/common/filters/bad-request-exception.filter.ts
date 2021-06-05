import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter
} from "@nestjs/common";

@Catch(BadRequestException)
export class BadRequestExceptionFilter
    implements ExceptionFilter<BadRequestException>
{
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = exception.getStatus();

        response.status(statusCode).json({
            statusCode,
            timestamp: new Date().toISOString(),
            message: "Parameter validation failed"
        });
    }
}
