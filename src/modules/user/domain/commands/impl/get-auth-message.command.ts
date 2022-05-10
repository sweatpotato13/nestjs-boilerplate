import { ICommand } from "@nestjs/cqrs";

import { AccountDto } from "../../dtos";

export class GetAuthMessageCommand implements ICommand {
    constructor(public readonly args: AccountDto) { }
}
