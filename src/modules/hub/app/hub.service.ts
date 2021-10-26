import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
    runOnTransactionCommit,
    runOnTransactionRollback,
    runOnTransactionComplete,
    Transactional
} from "typeorm-transactional-cls-hooked";
import { RegisterHubCommand, DiscardHubCommand } from "../domain/commands/impl";
import { RegisterHubDto, DiscardHubDto } from "../domain/dtos";
import { IHubService } from "../domain/interfaces/hub.interface";
import { HealthCheckQuery } from "../domain/queries/impl";

@Injectable()
export class HubService implements IHubService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) { }

    public async healthCheck(): Promise<any> {
        try {
            const result = await this._queryBus.execute(new HealthCheckQuery());
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Transactional()
    public async registerHub(data: RegisterHubDto): Promise<any> {
        try {
            const result = await this._commandBus.execute(
                new RegisterHubCommand(data)
            );
            runOnTransactionCommit(() => { });
            return result;
        } catch (error) {
            runOnTransactionRollback(() => { });
            throw error;
        } finally {
            runOnTransactionComplete(() => { });
        }
    }

    @Transactional()
    public async discardHub(data: DiscardHubDto): Promise<any> {
        try {
            const result = await this._commandBus.execute(
                new DiscardHubCommand(data)
            );
            runOnTransactionCommit(() => { });
            return result;
        } catch (error) {
            runOnTransactionRollback(() => { });
            throw error;
        } finally {
            runOnTransactionComplete(() => { });
        }
    }
}
