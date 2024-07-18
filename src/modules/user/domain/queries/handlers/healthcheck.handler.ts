import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { HealthCheckQuery } from "../impl";

@QueryHandler(HealthCheckQuery)
export class HealthCheckHandler implements IQueryHandler<HealthCheckQuery> {
    constructor() {}

    execute(command: HealthCheckQuery) {
        const {} = command;
        return "HealthCheck :)";
    }
}
