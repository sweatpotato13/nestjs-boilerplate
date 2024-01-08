import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { logger } from "@src/config/modules/winston";
import { ResultResponseDto } from "@src/shared/dtos";
import { User } from "@src/shared/entities";
import { BadRequestException } from "@src/shared/models/error/http.error";
import { Repository } from "typeorm";

import { UpdateUserProfileCommand } from "../impl";

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileHandler
    implements ICommandHandler<UpdateUserProfileCommand>
{
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async execute(command: UpdateUserProfileCommand) {
        try {
            const { id, userId, profile } = command;
            const { name } = profile;

            if (id !== userId) {
                throw new BadRequestException("user id not matches", {
                    context: "UpdateUserProfileCommand"
                });
            }

            const user = await this.userRepo.findOne({ where: { id } });
            if (!user) {
                throw new BadRequestException("user not found", {
                    context: "UpdateUserProfileCommand"
                });
            }

            user.name = name;
            await this.userRepo.save(user);

            return ResultResponseDto.of({
                result: "OK"
            });
        } catch (error: any) {
            logger.error(error.message);
            throw error;
        }
    }
}
