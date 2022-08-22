import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { Roles } from "@src/common/decorator/roles.decorator";
import { Role } from "@src/shared/models/enum";

import { AccountDto, AuthMessageDto, LoginDto, RefreshTokenBodyDto, ResultDto,TokensResponseDto } from "../domain/dtos";
import { UserService } from "./user.service";

@Controller("user")
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

    @Post("get-auth")
    async getAuthMsg(
        @Body() args: AccountDto
    ): Promise<AuthMessageDto> {
        try {
            const result = await this._service.getAuthMsg(args);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("register")
    async register(@Body() args: LoginDto): Promise<TokensResponseDto> {
        try {
            const result = await this._service.register(args);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("login")
    async login(@Body() args: LoginDto): Promise<TokensResponseDto> {
        try {
            const result = await this._service.login(args);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("refresh")
    async refresh(@Body() args: RefreshTokenBodyDto): Promise<TokensResponseDto> {
        try {
            const result = await this._service.refresh(args);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("deregister")
    @Roles(Role.User)
    async deregister(@Body() args: LoginDto): Promise<ResultDto> {
        try {
            const result = await this._service.deregister(args);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
