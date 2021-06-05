import { createParamDecorator } from "@nestjs/common";

export const TransactionParam: () => ParameterDecorator = () => {
    return createParamDecorator((_data, req) => {
        return req.transaction;
    });
};
