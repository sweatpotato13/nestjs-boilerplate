import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { runOnTransactionCommit, runOnTransactionComplete, runOnTransactionRollback, Transactional } from "typeorm-transactional";

import { GoogleLoginCommand } from "../domain/commands/impl/google-login.command";
import { TokensResponseDto, UserDto } from "../domain/dtos";


@Injectable()
export class AuthService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) { }

    @Transactional()
    public async googleLogin(user: UserDto): Promise<TokensResponseDto> {
        try {
            const result = await this._commandBus.execute(
                new GoogleLoginCommand(user)
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