import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Hub } from "@src/shared/entities";
import { Repository } from "typeorm";
import { RegisterHubCommand } from "../impl";

@CommandHandler(RegisterHubCommand)
export class RegisterHubHandler implements ICommandHandler<RegisterHubCommand> {
    constructor(
        @InjectRepository(Hub)
        private readonly _hubRepo: Repository<Hub>
    ) {}

    async execute(command: RegisterHubCommand) {
        return "";
    }
}
