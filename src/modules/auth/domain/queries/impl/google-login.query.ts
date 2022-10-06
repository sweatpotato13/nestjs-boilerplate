import { IQuery } from "@nestjs/cqrs";

export class GoogleLoginQuery implements IQuery {
    constructor(public readonly args: any) {}
}
