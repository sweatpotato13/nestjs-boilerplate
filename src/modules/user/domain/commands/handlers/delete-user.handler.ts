import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../impl';
import { logger } from '@src/config/modules/winston';
import { ResultResponseDto } from '@src/shared/dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/shared/entities';
import { Repository } from 'typeorm';
import { BadRequestException } from '@src/shared/models/error/http.error';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async execute(command: DeleteUserCommand) {
        try {
            const { id } = command;

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