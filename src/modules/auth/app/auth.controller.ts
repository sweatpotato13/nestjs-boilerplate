import { Controller, Get, Inject, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResultResponseDto } from "@src/shared/dtos";
import { Request } from "express";

import { TokensResponseDto, UserDto } from "../domain/dtos";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(
        @Inject("AuthService") private readonly _service: AuthService
    ) {}

    /**
     * Handles the Google login request.
     * This route is protected by the Google authentication guard.
     * @returns {ResultResponseDto} The result of the login request.
     *
     * @tag auth
     */
    @Get("login/google")
    @UseGuards(AuthGuard("google"))
    handleLogin(): ResultResponseDto {
        const result = ResultResponseDto.of({
            result: "Google Authentication"
        });
        return result;
    }

    /**
     * Handles the Google callback after successful authentication.
     * This route is protected by the Google authentication guard.
     * @param {Request} req - The request object.
     * @returns {Promise<TokensResponseDto>} The tokens response DTO.
     *
     * @internal
     * @tag auth
     */
    @Get("login/google/callback")
    @UseGuards(AuthGuard("google"))
    handleRedirect(@Req() req: Request): Promise<TokensResponseDto> {
        const { user } = req;
        const result = this._service.googleLogin(UserDto.of(user as any));
        return result;
    }
}
