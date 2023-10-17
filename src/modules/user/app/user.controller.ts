import { Body, Controller, Delete, Get, Inject, Param, Put, UseGuards, HttpCode } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { UserService } from "./user.service";
import { AuthGuard } from "@src/common/guard/auth.guard";
import { GetUserId } from "@src/common/decorator/get-user-did.decorator";
import { ProfileBodyDto } from "../domain/dtos";

@Controller("users")
export class UserController {
    constructor(
        @Inject("UserService") private readonly _service: UserService
    ) { }

    @Get()
    @HttpCode(200)
    async healthCheck(): Promise<any> {
        try {
            const result = await this._service.healthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Get("/:id")
    @HttpCode(200)
    async getUserById(@Param("id") id: string): Promise<any> {
        try {
            const result = await this._service.getUserById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Get("/:email")
    @HttpCode(200)
    async getUserByEmail(@Param("email") email: string): Promise<any> {
        try {
            const result = await this._service.getUserByEmail(email);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Put("/:id/profile")
    @UseGuards(AuthGuard)
    @HttpCode(201)
    async updateUserProfile(@GetUserId() id: string, @Body() profile: ProfileBodyDto): Promise<any> {
        try {
            const result = await this._service.updateUserProfile(id, profile);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Delete("/:id")
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async deleteUser(@GetUserId() id: string): Promise<any> {
        try {
            const result = await this._service.deleteUser(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Get("mq")
    @HttpCode(200)
    async mqHealthCheck(): Promise<any> {
        try {
            const result = await this._service.mqHealthCheck();
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
