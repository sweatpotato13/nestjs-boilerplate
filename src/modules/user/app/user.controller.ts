import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
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

    /**
     * Health check endpoint.
     * @returns A Promise that resolves to the health check result.
     * @throws Throws an error if an error occurs during the health check.
     *
     * @tag user
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    async healthCheck(): Promise<any> {
        try {
            const result = await this.service.healthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user by ID.
     * @param id - The ID of the user.
     * @returns A Promise that resolves to the user with the specified ID.
     * @throws Throws an error if an error occurs while retrieving the user.
     *
     * @tag user
     */
    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param("id") id: string): Promise<any> {
        try {
            const result = await this.service.getUserById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user by email.
     * @param email - The email of the user.
     * @returns A Promise that resolves to the user with the specified email.
     * @throws Throws an error if an error occurs while retrieving the user.
     *
     * @tag user
     */
    @Get("/:email")
    @HttpCode(HttpStatus.OK)
    async getUserByEmail(@Param("email") email: string): Promise<any> {
        try {
            const result = await this.service.getUserByEmail(email);
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user profile.
     * @security bearer
     * @param id - The ID of the user.
     * @param userId - The ID of the authenticated user.
     * @param profile - The updated profile data.
     * @returns A Promise that resolves to the updated user profile.
     * @throws Throws an error if an error occurs while updating the user profile.
     *
     * @security bearer
     * @tag user
     */
    @Put("/:id/profile")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
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
     * Delete user.
     * @security bearer
     * @param id - The ID of the user to delete.
     * @param userId - The ID of the authenticated user.
     * @returns A Promise that resolves to the result of the delete operation.
     * @throws Throws an error if an error occurs while deleting the user.
     *
     * @security bearer
     * @tag user
     */
    @Delete("/:id")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
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

    /**
     * Message queue health check endpoint.
     * @returns A Promise that resolves to the health check result.
     * @throws Throws an error if an error occurs during the health check.
     *
     * @internal
     * @tag user
     */
    @Get("mq")
    @HttpCode(HttpStatus.OK)
    async mqHealthCheck(): Promise<any> {
        try {
            const result = await this.service.mqHealthCheck();
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Message queue receiver.
     * @param data - The received message data.
     *
     * @internal
     * @tag user
     */
    @MessagePattern({ cmd: "hello" })
    mqReceiver(@Payload() data: string) {
        console.log(data);
    }
}
