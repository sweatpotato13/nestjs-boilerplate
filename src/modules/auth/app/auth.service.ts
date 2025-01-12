import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { GoogleLoginCommand } from "../domain/commands/impl/google-login.command";
import { TokensResponseDto, UserDto } from "../domain/dtos";

@Injectable()
export class AuthService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) {}

    public async googleLogin(user: UserDto): Promise<TokensResponseDto> {
        const result = await this.commandBus.execute(
            new GoogleLoginCommand(user)
        );
        return result;
    }
}
