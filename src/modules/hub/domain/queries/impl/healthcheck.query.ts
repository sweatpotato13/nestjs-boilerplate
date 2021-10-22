import { IQuery } from "@nestjs/cqrs";

export class HealthCheckQuery implements IQuery {
    constructor(/*public readonly data: any*/) {}
}
