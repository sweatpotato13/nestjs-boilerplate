import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Hub } from "@src/shared/entities";
import { Repository } from "typeorm";
import { DiscardHubCommand } from "../impl";

@CommandHandler(DiscardHubCommand)
export class DiscardHubHandler implements ICommandHandler<DiscardHubCommand> {
    constructor(
        @InjectRepository(Hub)
        private readonly _hubRepo: Repository<Hub>
    ) {}

    async execute(command: DiscardHubCommand): Promise<any> {
        return "";
    }
}
