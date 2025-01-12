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

        if (!request.headers.authorization) {
            throw new UnauthorizedException("Authorization is required");
        }

        const payload = (await this.jwtService.decodeJwt(
            request.headers.authorization as string
        )) as { userId: string; type: string };

        if (!payload) {
            throw new UnauthorizedException("Invalid access token");
        }

        // 항상 payload를 설정
        request.extra = payload;

        const roles = this.reflector.getAllAndMerge<string[]>("roles", [
            context.getHandler(),
            context.getClass()
        ]);

        // role 체크가 필요없으면 여기서 return
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
