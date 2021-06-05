import { ICommand } from "@nestjs/cqrs";
import { DiscardHubDto } from "../../dtos/discard-hub.dto";

export class DiscardHubCommand implements ICommand {
    constructor(public readonly data: DiscardHubDto) {}
}
