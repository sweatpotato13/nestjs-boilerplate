import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
    runOnTransactionCommit,
    runOnTransactionRollback,
    runOnTransactionComplete,
    Transactional
} from "typeorm-transactional-cls-hooked";
import { IHubService } from "../domain/interfaces/hub.interface";
import { RegisterHubDto } from "../domain/dtos/register-hub.dto";
import { DiscardHubDto } from "../domain/dtos/discard-hub.dto";
import { RegisterHubCommand } from "../domain/commands/impl/register-hub.command";
import { DiscardHubCommand } from "../domain/commands/impl/discard-hub.command";

@Injectable()
export class HubService implements IHubService {
    constructor(private readonly _commandBus: CommandBus) {}

    @Transactional()
    public async registerHub(data: RegisterHubDto): Promise<any> {
        try {
            const ret = await this._commandBus.execute(
                new RegisterHubCommand(data)
            );
            runOnTransactionCommit(() => {});
            return ret;
        } catch (error) {
            runOnTransactionRollback(() => {});
            throw error;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }
    @Transactional()
    public async discardHub(data: DiscardHubDto): Promise<any> {
        try {
            const ret = await this._commandBus.execute(
                new DiscardHubCommand(data)
            );
            runOnTransactionCommit(() => {});
            return ret;
        } catch (error) {
            runOnTransactionRollback(() => {});
            throw error;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }
}
