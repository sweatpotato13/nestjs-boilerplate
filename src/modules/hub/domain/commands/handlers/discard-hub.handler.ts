import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Hub } from "@src/common/entities";
import { IHubRepository } from "@src/shared/interfaces/repository/hub-repository.interface";
import { DiscardHubCommand } from "../impl/discard-hub.command";

@CommandHandler(DiscardHubCommand)
export class DiscardHubHandler implements ICommandHandler<DiscardHubCommand> {
    constructor(
        @InjectRepository(Hub)
        private readonly _hubRepo: IHubRepository
    ) {}

    async execute(command: DiscardHubCommand): Promise<any> {
        return "";
    }
}
