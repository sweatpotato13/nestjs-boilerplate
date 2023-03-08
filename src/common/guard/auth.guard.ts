import { config } from "@config";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UnauthorizedException } from "@src/shared/models/error/http.error";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private _reflector: Reflector,
        private _jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (request.headers["x-app-secret"] !== config.appSecret) {
            throw new UnauthorizedException("Invalid app secret");
        }

        const roles = this._reflector.getAllAndMerge<string[]>("roles", [
            context.getHandler(),
            context.getClass()
        ]);

        if (!roles.length || roles.includes("Any")) return true;

        if (!request.headers.authorization) {
            throw new UnauthorizedException("Authorization is required");
        }

        const payload = (await this._jwtService.decodeJwt(
            request.headers.authorization
        )) as { userId: string };

        if (!payload) {
            throw new UnauthorizedException("Invalid access token");
        }

        if (!(await this._jwtService.checkUserId(payload.userId))) {
            throw new UnauthorizedException("Invalid user id");
        }

        const userRoles: string[] = await this._jwtService.getUserRoles(
            payload.userId
        );

        return userRoles.some(role => roles.includes(role));
    }
}
