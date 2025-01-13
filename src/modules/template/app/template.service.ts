import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { BaseResponseDto } from "@src/shared/dtos";

import { HealthCheckQuery } from "../domain/queries/impl";

@Injectable()
export class TemplateService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    public async healthCheck(): Promise<BaseResponseDto<undefined>> {
        const result = await this.queryBus.execute(new HealthCheckQuery());
        return result;
    }
}
