import { ICommand } from '@nestjs/cqrs';

export class UpdateUserProfileCommand implements ICommand {
    constructor(public readonly id: string, public readonly profile: any) { }
}