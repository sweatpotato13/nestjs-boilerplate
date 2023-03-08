import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { HealthCheckQuery, MqHealthCheckQuery } from "../domain/queries/impl";

@Injectable()
export class UserService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) {}

    public async healthCheck(): Promise<any> {
        try {
            const result = await this._queryBus.execute(new HealthCheckQuery());
            return result;
        } catch (error) {
            throw error;
        }
    }

    public async mqHealthCheck(): Promise<any> {
        try {
            const result = await this._queryBus.execute(
                new MqHealthCheckQuery()
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}
