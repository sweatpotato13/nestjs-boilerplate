import { ICommand } from "@nestjs/cqrs";
import { RegisterHubDto } from "../../dtos/register-hub.dto";

export class RegisterHubCommand implements ICommand {
    constructor(public readonly data: RegisterHubDto) {}
}
