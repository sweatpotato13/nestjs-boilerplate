import { HttpException, HttpStatus } from "@nestjs/common";
import { logger } from "@src/config/modules/winston";

import { IExceptionProps } from ".";

export class NotFoundException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.NOT_FOUND);
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.BAD_REQUEST);
    }
}

export class UnsupportedMediaTypeException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.FORBIDDEN);
    }
}

export class ConflictException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.CONFLICT);
    }
}

export class MethodNotAllowedException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.METHOD_NOT_ALLOWED);
    }
}

export class RequestTimeoutException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.REQUEST_TIMEOUT);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.UNAUTHORIZED);
    }
}

export class NotImplementedException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.NOT_IMPLEMENTED);
    }
}

export class PayloadTooLargeException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.PAYLOAD_TOO_LARGE);
    }
}

export class ValidationException extends HttpException {
    constructor(message: string, properties?: IExceptionProps) {
        logger.error(message, properties);
        super({ message, ...properties }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
