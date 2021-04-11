import { Injectable } from "@nestjs/common";
import { AppAggregate } from "../../domainModel/aggregate/app.aggregate";

@Injectable()
export class AppService {
    constructor(private readonly appManager: AppAggregate) {}

    getHello(): string {
        return this.appManager.getHello();
    }
}
