import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { getConnection } from "typeorm";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const httpContext = context.switchToHttp();
        const req = httpContext.getRequest();

        const queryRunner = getConnection().createQueryRunner();
        queryRunner.startTransaction();

        req.transaction = queryRunner.manager;

        return next.handle().pipe(
            tap(async () => {
                await queryRunner.commitTransaction();
            }),
            catchError(async err => {
                await queryRunner.rollbackTransaction();
                return throwError(err);
            }),
            finalize(async () => {
                await queryRunner.release();
            })
        );
    }
}
