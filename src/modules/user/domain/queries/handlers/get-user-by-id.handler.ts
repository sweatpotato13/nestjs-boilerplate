import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { logger } from "@src/config/modules/winston";
import { BadRequestException } from "@src/shared/models/error/http.error";
import { PrismaService } from "@src/shared/services";

import { GetUserResponseDto } from "../../dtos";
import { GetUserByIdQuery } from "../impl";

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(
        @Inject("PrismaService")
        private readonly prismaService: PrismaService
    ) {}

    async execute(query: GetUserByIdQuery) {
        try {
            const { id, userId } = query;
            if (typeof id !== "string" || !id.trim()) {
                throw new BadRequestException("id is required");
            }
            if (typeof userId !== "string" || !userId.trim()) {
                throw new BadRequestException("user id is required");
            }
            if (id !== userId) {
                throw new BadRequestException("user not found");
            }

            const user = await this.prismaService.user.findFirst({
                where: { id },
                select: { id: true, name: true, email: true }
            });
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
