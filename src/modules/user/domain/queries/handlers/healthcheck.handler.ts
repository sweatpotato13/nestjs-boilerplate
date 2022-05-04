import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { HealthCheckQuery } from "../impl";

@QueryHandler(HealthCheckQuery)
export class HealthCheckHandler implements IQueryHandler<HealthCheckQuery> {
    constructor() {}

    async execute(command: HealthCheckQuery) {
        return "";
    }
}
