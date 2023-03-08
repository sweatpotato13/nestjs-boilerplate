import { Controller, Get, Inject } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(
        @Inject("UserService") private readonly _service: UserService
    ) {}

    @Get()
    async healthCheck(): Promise<any> {
        try {
            const result = await this._service.healthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Get("mq")
    async MqHealthCheck(): Promise<any> {
        try {
            const result = await this._service.mqHealthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern({ cmd: "hello" })
    rabbitMqHealthCheck(@Payload() data: string) {
        console.log(data);
    }
}
