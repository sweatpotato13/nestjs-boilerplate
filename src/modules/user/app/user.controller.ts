import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller()
export class UserController {
    constructor(@Inject("UserService") private readonly _service: UserService) { }

    @Get()
    async healthCheck(): Promise<any> {
        try {
            const result = await this._service.healthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }
}
