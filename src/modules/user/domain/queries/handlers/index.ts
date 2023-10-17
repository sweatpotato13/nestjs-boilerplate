import { HealthCheckHandler } from "./healthcheck.handler";
import { MqHealthCheckHandler } from "./mq-healthcheck.handler";
import { GetUserByEmailHandler } from "./get-user-by-email.handler";
import { GetUserByIdHandler } from "./get-user-by-id.handler";

export const QueryHandlers = [HealthCheckHandler, MqHealthCheckHandler, GetUserByEmailHandler, GetUserByIdHandler];
