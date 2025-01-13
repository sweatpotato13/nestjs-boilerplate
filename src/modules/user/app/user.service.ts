import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { BaseResponseDto } from "@src/shared/dtos";

import {
    DeleteUserCommand,
    UpdateUserProfileCommand
} from "../domain/commands/impl";
import { GetUserResponseDto, ProfileBodyDto } from "../domain/dtos";
import { GetUserByEmailQuery, GetUserByIdQuery } from "../domain/queries/impl";

@Injectable()
export class UserService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    public async getUserByEmail(email: string): Promise<GetUserResponseDto> {
        const result = await this.queryBus.execute(
            new GetUserByEmailQuery(email)
        );
        return result;
    }

    public async getUserById(id: string): Promise<GetUserResponseDto> {
        const result = await this.queryBus.execute(new GetUserByIdQuery(id));
        return result;
    }

    public async updateUserProfile(
        id: string,
        userId: string,
        profile: ProfileBodyDto
    ): Promise<BaseResponseDto<undefined>> {
        const result = await this.commandBus.execute(
            new UpdateUserProfileCommand(id, userId, profile)
        );
        return result;
    }

    public async deleteUser(
        id: string,
        userId: string
    ): Promise<BaseResponseDto<undefined>> {
        const result = await this.commandBus.execute(
            new DeleteUserCommand(id, userId)
        );
        return result;
    }
}
