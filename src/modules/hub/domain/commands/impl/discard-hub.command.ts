import { ICommand } from "@nestjs/cqrs";
import { DiscardHubDto } from "../../dtos";

export class DiscardHubCommand implements ICommand {
    constructor(public readonly data: DiscardHubDto) {}
}
