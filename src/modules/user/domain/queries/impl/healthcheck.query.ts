import { IQuery } from "@nestjs/cqrs";

export class HealthCheckQuery implements IQuery {
    constructor() {}
}
