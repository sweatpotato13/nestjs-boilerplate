import { ICommand } from '@nestjs/cqrs';

import { LoginDto } from "../../dtos"

export class RegisterCommand implements ICommand {
    constructor(public readonly args: LoginDto) { }
}