import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from "@nestjs/common";
import { logger } from "@src/config/modules/winston";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        logger.info("[nestjs] Before...");

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() =>
                    logger.info(`[nestjs] After... ${Date.now() - now}ms`)
                )
            );
    }
}
