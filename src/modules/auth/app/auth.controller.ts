import { Controller, Get, Inject, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

import { ResultDto, TokensResponseDto, UserDto } from "../domain/dtos";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(
        @Inject("AuthService") private readonly _service: AuthService
    ) {}

    @Get("google/login")
    @UseGuards(AuthGuard("google"))
    handleLogin(): ResultDto {
        const result = ResultDto.of({ result: "Google Authentication" });
        return result;
    }

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    handleRedirect(@Req() req: Request): Promise<TokensResponseDto> {
        const { user } = req;
        const result = this._service.googleLogin(UserDto.of(user));
        return result;
    }
}
