import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { Inject } from "typedi";
import { AuthMessageDto } from "../../dtos";

import { GetAuthMessageCommand } from "../impl";

@CommandHandler(GetAuthMessageCommand)
export class GetAuthMessageHandler
    implements ICommandHandler<GetAuthMessageCommand>
{
    constructor(
        @Inject("JwtService")
        private readonly _jwtService: JwtService
    ) { }

    async execute(command: GetAuthMessageCommand) {
        const { args } = command;
        const { account } = args;
        const authMessage = await this._jwtService.updateAuthMsg(account);
        return AuthMessageDto.of({ authMessage: authMessage });
    }
}
