import { ICommand } from "@nestjs/cqrs";

import { RefreshTokenBodyDto } from "../../dtos";

export class RefreshCommand implements ICommand {
    constructor(public readonly args: RefreshTokenBodyDto) {}
}
