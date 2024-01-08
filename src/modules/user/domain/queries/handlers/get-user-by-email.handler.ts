import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { logger } from "@src/config/modules/winston";
import { User } from "@src/shared/entities";
import { BadRequestException } from "@src/shared/models/error/http.error";
import { Repository } from "typeorm";

import { GetUserResponseDto } from "../../dtos";
import { GetUserByEmailQuery } from "../impl";

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
    implements IQueryHandler<GetUserByEmailQuery>
{
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async execute(query: GetUserByEmailQuery) {
        try {
            const { email } = query;

            const user = await this.userRepo.findOne({ where: { email } });
            if (!user) {
                throw new BadRequestException("user not found", {
                    context: "DeleteUserCommand"
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
