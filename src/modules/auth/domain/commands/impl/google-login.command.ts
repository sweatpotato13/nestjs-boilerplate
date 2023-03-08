import { ICommand } from "@nestjs/cqrs";

import { UserDto } from "../../dtos";

export class GoogleLoginCommand implements ICommand {
    constructor(public readonly args: UserDto) {}
}
