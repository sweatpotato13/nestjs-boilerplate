import { GetUserByEmailHandler } from "./get-user-by-email.handler";
import { GetUserByIdHandler } from "./get-user-by-id.handler";
import { HealthCheckHandler } from "./healthcheck.handler";

export const QueryHandlers = [
    HealthCheckHandler,
    GetUserByEmailHandler,
    GetUserByIdHandler
];
