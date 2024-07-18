import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
    runOnTransactionCommit,
    runOnTransactionComplete,
    runOnTransactionRollback
} from "typeorm-transactional";

import {
    DeleteUserCommand,
    UpdateUserProfileCommand
} from "../domain/commands/impl";
import { ProfileBodyDto } from "../domain/dtos";
import {
    GetUserByEmailQuery,
    GetUserByIdQuery,
    HealthCheckQuery,
    MqHealthCheckQuery
} from "../domain/queries/impl";

@Injectable()
export class UserService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    public healthCheck(): any {
        const result = this.queryBus.execute(new HealthCheckQuery());
        return result;
    }

    public async getUserById(id: string): Promise<any> {
        const result = await this.queryBus.execute(new GetUserByIdQuery(id));
        return result;
    }

    public async getUserByEmail(email: string): Promise<any> {
        const result = await this.queryBus.execute(
            new GetUserByEmailQuery(email)
        );
        return result;
    }

    public async updateUserProfile(
        id: string,
        userId: string,
        profile: ProfileBodyDto
    ): Promise<any> {
        try {
            const result = await this.commandBus.execute(
                new UpdateUserProfileCommand(id, userId, profile)
            );
            runOnTransactionCommit(() => {});
            return result;
        } catch (error) {
            runOnTransactionRollback(() => {});
            throw error;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }

    public async deleteUser(id: string, userId: string): Promise<any> {
        try {
            const result = await this.commandBus.execute(
                new DeleteUserCommand(id, userId)
            );
            runOnTransactionCommit(() => {});
            return result;
        } catch (error) {
            runOnTransactionRollback(() => {});
            throw error;
        } finally {
            runOnTransactionComplete(() => {});
        }
    }

    public async mqHealthCheck(): Promise<any> {
        const result = await this.queryBus.execute(new MqHealthCheckQuery());
        return result;
    }
}
