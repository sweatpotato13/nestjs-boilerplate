import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Hub } from "@src/common/entities";
import { IHubRepository } from "@src/shared/interfaces/repository/hub-repository.interface";
import { ErrorResponse } from "@src/shared/models/responses";
import { RegisterHubCommand } from "../impl/register-hub.command";

@CommandHandler(RegisterHubCommand)
export class RegisterHubHandler implements ICommandHandler<RegisterHubCommand> {
    constructor(
        @InjectRepository(Hub)
        private readonly _hubRepo: IHubRepository
    ) {}

    async execute(command: RegisterHubCommand) {
        return "";
    }
}
