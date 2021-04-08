import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { LoggerService } from "@shared/modules/logger/logger.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly _logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                this._logger.info(`${Date.now() - now}ms time elapsed`, {
                    context: "Interceptor",
                });
            })
        );
    }
}
