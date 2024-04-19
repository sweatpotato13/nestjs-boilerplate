import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    Param,
    Put,
    UseGuards
} from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { GetUserId } from "@src/common/decorator/get-user-id.decorator";
import { AuthGuard } from "@src/common/guard/auth.guard";

import { ProfileBodyDto } from "../domain/dtos";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
    constructor(@Inject("UserService") private readonly service: UserService) {}

    @Get()
    @HttpCode(200)
    async healthCheck(): Promise<any> {
        try {
            const result = await this.service.healthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Get("/:id")
    @HttpCode(200)
    async getUserById(@Param("id") id: string): Promise<any> {
        try {
            const result = await this.service.getUserById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Get("/:email")
    @HttpCode(200)
    async getUserByEmail(@Param("email") email: string): Promise<any> {
        try {
            const result = await this.service.getUserByEmail(email);
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @security bearer
     */
    @Put("/:id/profile")
    @UseGuards(AuthGuard)
    @HttpCode(201)
    async updateUserProfile(
        @Param("id") id: string,
        @GetUserId() userId: string,
        @Body() profile: ProfileBodyDto
    ): Promise<any> {
        try {
            const result = await this.service.updateUserProfile(
                id,
                userId,
                profile
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @security bearer
     */
    @Delete("/:id")
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async deleteUser(
        @Param("id") id: string,
        @GetUserId() userId: string
    ): Promise<any> {
        try {
            const result = await this.service.deleteUser(id, userId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Get("mq")
    @HttpCode(200)
    async mqHealthCheck(): Promise<any> {
        try {
            const result = await this.service.mqHealthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern({ cmd: "hello" })
    mqReceiver(@Payload() data: string) {
        console.log(data);
    }
}
