import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { logger } from '@src/config/modules/winston';
import { User } from '@src/shared/entities';
import { Repository } from 'typeorm';
import { BadRequestException } from '@src/shared/models/error/http.error';
import { GetUserResponseDto } from '../../dtos';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async execute(query: GetUserByIdQuery) {
        try {
            const { id } = query;

            const user = await this.userRepo.findOne({ where: { id } });
            if (!user) { 
                throw new BadRequestException("user not found", {
                    context: "GetUserByIdQuery"
                });
            }
            
            return GetUserResponseDto.of({
                result: "OK",
                user
            });
        } catch (error: any) {
            logger.error(error.message);
            throw error;
        }
    }
}