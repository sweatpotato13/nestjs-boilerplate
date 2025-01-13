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
    Query,
    UseGuards
} from "@nestjs/common";
import { GetUserId } from "@src/common/decorator/get-user-id.decorator";
import { AuthGuard } from "@src/common/guard/auth.guard";
import { BaseResponseDto } from "@src/shared/dtos";

import { GetUserResponseDto, ProfileBodyDto } from "../domain/dtos";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
    constructor(@Inject("UserService") private readonly service: UserService) {}

    /**
     * Get user by email.
     * @query email - The email of the user.
     * @returns A Promise that resolves to the user with the specified email.
     * @throws Throws an error if an error occurs while retrieving the user.
     *
     * @tag user
     */
    @Get("")
    @HttpCode(HttpStatus.OK)
    async getUserByEmail(
        @Query("email") email: string
    ): Promise<GetUserResponseDto> {
        const result = await this.service.getUserByEmail(email);
        return result;
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
    async getUserById(@Param("id") id: string): Promise<GetUserResponseDto> {
        const result = await this.service.getUserById(id);
        return result;
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
    @Put("/:id")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updateUserProfile(
        @Param("id") id: string,
        @GetUserId() userId: string,
        @Body() profile: ProfileBodyDto
    ): Promise<BaseResponseDto<undefined>> {
        const result = await this.service.updateUserProfile(
            id,
            userId,
            profile
        );
        return result;
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
    ): Promise<BaseResponseDto<undefined>> {
        const result = await this.service.deleteUser(id, userId);
        return result;
    }
}
