import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";

import { MqHealthCheckQuery } from "../impl";

@QueryHandler(MqHealthCheckQuery)
export class MqHealthCheckHandler implements IQueryHandler<MqHealthCheckQuery> {
    constructor(@Inject("RABBITMQ") private client: ClientProxy) {}

    execute(query: MqHealthCheckQuery): any {
        const {} = query;

        this.client
            .send({ cmd: "hello" }, "Hello World to rabbitmq!")
            .subscribe();
        return "MqHealthCheck :)";
    }
}
