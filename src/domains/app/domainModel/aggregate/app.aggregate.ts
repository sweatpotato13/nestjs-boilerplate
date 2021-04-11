import { Injectable } from "@nestjs/common";

@Injectable()
export class AppAggregate {
    getHello(): string {
        return "Hello World!";
    }
}
