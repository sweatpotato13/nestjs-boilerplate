import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { logger } from "@src/config/modules/winston";
import { BaseResponseDto } from "@src/shared/dtos";
import { BadRequestException } from "@src/shared/models/error/http.error";
import { PrismaService } from "@src/shared/services";

import { DeleteUserCommand } from "../impl";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @Inject("PrismaService")
        private readonly prismaService: PrismaService
    ) {}

    async execute(command: DeleteUserCommand) {
        try {
            const { id, userId } = command;
            return await this.prismaService.$transaction(async tx => {
                if (id !== userId) {
                    throw new BadRequestException("user id not matches", {
                        context: "DeleteUserCommand"
                    });
                }

                const user = await tx.user.findUnique({
                    where: { id }
                });
                if (!user) {
                    throw new BadRequestException("user not found", {
                        context: "DeleteUserCommand"
                    });
                }

                await tx.user.delete({ where: { id } });

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
