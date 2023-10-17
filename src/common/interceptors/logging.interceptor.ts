import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { logger } from "@src/config/modules/winston";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const method = context.getArgs()[0].method;
        const path = context.getArgs()[0].url;
        const body = context.getArgs()[0].body;
        const query = context.getArgs()[0].query;
        logger.info("[nestjs] Before...", {
            body,
            query,
            path: `${method} ${path}`
        });

        const now = Date.now();
        return next.handle().pipe(
            tap(() =>
                logger.info(`[nestjs] After... ${Date.now() - now}ms`, {
                    path: `${method} ${path}`
                })
            )
        );
    }
}
