import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UnauthorizedException } from "@src/shared/models/error/http.error";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { PrismaService } from "@src/shared/services";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject("JwtService")
        private readonly jwtService: JwtService,
        @Inject("PrismaService")
        private readonly prismaService: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authorization = request.headers.authorization;
        const token =
            typeof authorization === "string"
                ? /^Bearer +([^\s]+)$/i.exec(authorization)?.[1]
                : undefined;
        if (!token) {
            throw new UnauthorizedException("Bearer access token is required");
        }

        const payload = await this.jwtService.decodeJwt(token);

        if (
            !payload ||
            payload.type !== "accessToken" ||
            typeof payload.userId !== "string" ||
            !payload.userId.trim()
        ) {
            throw new UnauthorizedException("Invalid access token");
        }

        request.extra = payload;

        const roles = this.reflector.getAllAndMerge<string[]>("roles", [
            context.getHandler(),
            context.getClass()
        ]);

        if (!roles.length || roles.includes("Any")) return true;

        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.userId
            },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
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
