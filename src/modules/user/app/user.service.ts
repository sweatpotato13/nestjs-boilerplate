import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
    runOnTransactionCommit,
    runOnTransactionRollback,
    runOnTransactionComplete,
    Transactional
} from "typeorm-transactional-cls-hooked";
import { GetAuthMessageCommand, LoginCommand, RefreshCommand } from "../domain/commands/impl";
import { AccountDto, AuthMessageDto, LoginDto, TokensResponseDto, RefreshTokenBodyDto } from "../domain/dtos";
import { HealthCheckQuery } from "../domain/queries/impl";

@Injectable()
export class UserService {
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

    public async getAuthMsg(args: AccountDto): Promise<AuthMessageDto> {
        try {
            const result = await this._commandBus.execute(
                new GetAuthMessageCommand(args)
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Transactional()
    public async login(args: LoginDto): Promise<TokensResponseDto> {
        try {
            const result = await this._commandBus.execute(
                new LoginCommand(args)
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

    public async refresh(args: RefreshTokenBodyDto): Promise<TokensResponseDto> {
        try {
            const result = await this._commandBus.execute(
                new RefreshCommand(args)
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}
