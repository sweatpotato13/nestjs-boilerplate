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
                let user = await tx.user.findFirst({
                    where: {
                        email: email
                    }
                });

                if (!user) {
                    user = await tx.user.create({
                        data: {
                            email,
                            name,
                            provider
                        }
                    });

                    let role = await tx.role.findFirst({
                        where: { name: "user" }
                    });
                    if (!role) {
                        role = await tx.role.create({
                            data: {
                                name: "user",
                                description: "user role"
                            }
                        });
                    }

                    const userRole = await tx.userRole.findFirst({
                        where: { userId: user.id }
                    });
                    if (!userRole) {
                        await tx.userRole.create({
                            data: {
                                userId: user.id,
                                roleId: role.id
                            }
                        });
                    }
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
