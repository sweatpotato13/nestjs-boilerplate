import { Controller, Get, Inject, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(
        @Inject("AuthService") private readonly _service: AuthService
    ) { }

    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth(): Promise<void> {
        // redirect google login page
    }

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleAuthCallback(@Req() req: any): Promise<void> {
        const user = this._service.googleLogin(req);
        console.log(user);
    }
}
