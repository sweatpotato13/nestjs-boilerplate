import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { logger } from "@src/config/modules/winston";
import { ResultResponseDto } from "@src/shared/dtos";
import { User } from "@src/shared/entities";
import { BadRequestException } from "@src/shared/models/error/http.error";
import { Repository } from "typeorm";

import { DeleteUserCommand } from "../impl";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async execute(command: DeleteUserCommand) {
        try {
            const { id, userId } = command;

            if (id !== userId) {
                throw new BadRequestException("user id not matches", {
                    context: "DeleteUserCommand"
                });
            }

            const user = await this.userRepo.findOne({ where: { id } });
            if (!user) {
                throw new BadRequestException("user not found", {
                    context: "DeleteUserCommand"
                });
            }

            await this.userRepo.remove(user);

            return ResultResponseDto.of({
                result: "OK"
            });
        } catch (error: any) {
            logger.error(error.message);
            throw error;
        }
    }
}
