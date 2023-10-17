import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { BadRequestException } from "@src/shared/models/error/http.error";

export const QueryRequired = createParamDecorator(
    (key: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        // eslint-disable-next-line security/detect-object-injection
        const value = request.query[key];

        if (value === undefined) {
            throw new BadRequestException(
                `Missing required query param: '${key}'`
            );
        }

        return value;
    }
);
