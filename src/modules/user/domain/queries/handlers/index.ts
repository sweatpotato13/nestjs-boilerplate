import { HealthCheckHandler } from "./healthcheck.handler";
import { MqHealthCheckHandler } from "./mq-healthcheck.handler";

export const QueryHandlers = [HealthCheckHandler, MqHealthCheckHandler];
