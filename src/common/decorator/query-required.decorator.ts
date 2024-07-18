import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { BadRequestException } from "@src/shared/models/error/http.error";

export const QueryRequired = createParamDecorator(
    (key: string, ctx: ExecutionContext): any => {
        const request = ctx.switchToHttp().getRequest();

        const value = request.query[key];

        if (value === undefined) {
            throw new BadRequestException(
                `Missing required query param: '${key}'`
            );
        }

        return value;
    }
);
