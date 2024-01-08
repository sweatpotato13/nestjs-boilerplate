import { config } from "@config";
import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@src/shared/entities";
import { UnauthorizedException } from "@src/shared/models/error/http.error";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject("JwtService")
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (request.headers["x-app-secret"] !== config.appSecret) {
            throw new UnauthorizedException("Invalid app secret");
        }

        const roles = this.reflector.getAllAndMerge<string[]>("roles", [
            context.getHandler(),
            context.getClass()
        ]);

        if (!roles.length || roles.includes("Any")) return true;

        if (!request.headers.authorization) {
            throw new UnauthorizedException("Authorization is required");
        }

        const payload = (await this.jwtService.decodeJwt(
            request.headers.authorization
        )) as { userId: string; type: string };

        if (!payload) {
            throw new UnauthorizedException("Invalid access token");
        }

        // Attach the payload to the request for later use
        request.extra = payload;

        const user: User = await this.userRepo.findOne({
            where: {
                id: payload.userId
            }
        });

        if (!user) {
            throw new UnauthorizedException("Invalid user id");
        }

        const userRoles: string[] = user.userRoles
            ? user.userRoles.map(cur => {
                  return cur.role.name;
              })
            : [];

        return userRoles.some(role => roles.includes(role));
    }
}
