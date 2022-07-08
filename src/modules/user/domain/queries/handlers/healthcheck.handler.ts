import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ElasticsearchService } from "@nestjs/elasticsearch";

import { HealthCheckQuery } from "../impl";

@QueryHandler(HealthCheckQuery)
export class HealthCheckHandler implements IQueryHandler<HealthCheckQuery> {
    constructor(
        private readonly _client: ElasticsearchService,
    ) { }

    async execute(command: HealthCheckQuery) {
        return "HealthCheck :)";
    }
}
