import {
    Controller,
    Get,
    Inject,
    Optional,
    Req,
    UseGuards
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { GoogleOauthConfig } from "@src/config";
import { BaseResponseDto } from "@src/shared/dtos";
import { Request } from "express";

import { TokensResponseDto, UserDto } from "../domain/dtos";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    private googleAuthEnabled: boolean;

    constructor(
        @Inject("AuthService") private readonly service: AuthService,
        @Optional()
        @Inject(GoogleOauthConfig.KEY)
        config?: ConfigType<typeof GoogleOauthConfig>
    ) {
        this.googleAuthEnabled = !!(
            config?.clientId &&
            config?.clientSecret &&
            config?.redirect
        );
    }

    /**
     * Handles the Google login request.
     * This route is protected by the Google authentication guard.
     * @returns {BaseResponseDto} The result of the login request.
     *
     * @tag auth
     */
    @Get("login/google")
    @UseGuards(AuthGuard("google"))
    handleLogin(): BaseResponseDto<undefined> {
        if (!this.googleAuthEnabled) {
            throw new Error("Google authentication is not configured");
        }
        return BaseResponseDto.of<undefined>({
            message: "Google Authentication"
        });
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
        return this.service.googleLogin(UserDto.of(user as any));
    }
}
