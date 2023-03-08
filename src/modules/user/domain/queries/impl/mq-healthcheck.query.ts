import { IQuery } from "@nestjs/cqrs";

export class MqHealthCheckQuery implements IQuery {
    constructor(/*public readonly data: any*/) {}
}
