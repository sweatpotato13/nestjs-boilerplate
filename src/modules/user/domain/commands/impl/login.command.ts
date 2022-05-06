import { ICommand } from "@nestjs/cqrs";
import { LoginDto } from "../../dtos";

export class LoginCommand implements ICommand {
    constructor(public readonly args: LoginDto) { }
}
