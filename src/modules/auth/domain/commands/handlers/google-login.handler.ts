import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { logger } from "@src/config/modules/winston";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { PrismaService } from "@src/shared/services";

import { TokensResponseDto } from "../../dtos";
import { GoogleLoginCommand } from "../impl/google-login.command";

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
    constructor(
        @Inject("JwtService")
        private readonly jwtService: JwtService,
        @Inject("PrismaService")
        private readonly prismaService: PrismaService
    ) {}

    async execute(command: GoogleLoginCommand) {
        try {
            const { args } = command;
            const { provider, email, name } = args;

            return await this.prismaService.$transaction(async tx => {
                let user = await tx.user.findUnique({
                    where: {
                        email: email
                    }
                });

                if (!user) {
                    // A non-empty update lets Prisma use PostgreSQL's atomic upsert.
                    user = await tx.user.upsert({
                        where: { email },
                        update: { email },
                        create: {
                            email,
                            name,
                            provider
                        }
                    });

                    const role = await tx.role.upsert({
                        where: { name: "user" },
                        update: { name: "user" },
                        create: {
                            name: "user",
                            description: "user role"
                        }
                    });

                    await tx.userRole.createMany({
                        data: { userId: user.id, roleId: role.id },
                        skipDuplicates: true
                    });
                }
                const tokens = this.jwtService.createUserJwt(user.id);

                return TokensResponseDto.of({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                });
            });
        } catch (error: any) {
            logger.error(error.message);
            throw error;
        }
    }
}
