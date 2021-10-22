import { ICommand } from "@nestjs/cqrs";
import { RegisterHubDto } from "../../dtos";

export class RegisterHubCommand implements ICommand {
    constructor(public readonly data: RegisterHubDto) {}
}
