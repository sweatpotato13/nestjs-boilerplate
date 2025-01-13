import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { logger } from "@src/config/modules/winston";
import { BaseResponseDto } from "@src/shared/dtos";
import { BadRequestException } from "@src/shared/models/error/http.error";
import { PrismaService } from "@src/shared/services";

import { UpdateUserProfileCommand } from "../impl";

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileHandler
    implements ICommandHandler<UpdateUserProfileCommand>
{
    constructor(
        @Inject("PrismaService")
        private readonly prismaService: PrismaService
    ) {}

    async execute(command: UpdateUserProfileCommand) {
        try {
            return await this.prismaService.$transaction(async tx => {
                const { id, userId, profile } = command;
                const { name } = profile;

                if (id !== userId) {
                    throw new BadRequestException("user id not matches", {
                        context: "UpdateUserProfileCommand"
                    });
                }

                const user = await tx.user.findUnique({
                    where: { id }
                });
                if (!user) {
                    throw new BadRequestException("user not found", {
                        context: "UpdateUserProfileCommand"
                    });
                }

                user.name = name;
                await tx.user.update({
                    where: { id },
                    data: { name }
                });

                return BaseResponseDto.of({
                    message: "OK"
                });
            });
        } catch (error: any) {
            logger.error(error.message);
            throw error;
        }
    }
}
