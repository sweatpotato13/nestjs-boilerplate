import { ICommand } from '@nestjs/cqrs';

import { LoginDto } from '../../dtos';

export class DeregisterCommand implements ICommand {
    constructor(public readonly args: LoginDto) { }
}