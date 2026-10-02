import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { logger } from "@src/config/modules/winston";
import { BadRequestException } from "@src/shared/models/error/http.error";
import { PrismaService } from "@src/shared/services";

import { GetUserResponseDto } from "../../dtos";
import { GetUserByEmailQuery } from "../impl";

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
    constructor(
        @Inject("PrismaService")
        private readonly prismaService: PrismaService
    ) {}

    async execute(query: GetUserByEmailQuery) {
        try {
            const { email, userId } = query;
            if (typeof email !== "string" || !email.trim()) {
                throw new BadRequestException("email is required");
            }
            if (typeof userId !== "string" || !userId.trim()) {
                throw new BadRequestException("user id is required");
            }

            const user = await this.prismaService.user.findFirst({
                where: { email, id: userId },
                select: { id: true, name: true, email: true }
            });
            if (!user) {
                throw new BadRequestException("user not found", {
                    context: "GetUserByEmailQuery"
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
