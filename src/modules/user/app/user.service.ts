import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { GetUserByEmailQuery, GetUserByIdQuery, HealthCheckQuery, MqHealthCheckQuery } from "../domain/queries/impl";
import { runOnTransactionCommit, runOnTransactionRollback, runOnTransactionComplete } from "typeorm-transactional";
import { DeleteUserCommand, UpdateUserProfileCommand } from "../domain/commands/impl";
import { ProfileBodyDto } from "../domain/dtos";

@Injectable()
export class UserService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) { }

    public async healthCheck(): Promise<any> {
        try {
            const result = await this._queryBus.execute(new HealthCheckQuery());
            return result;
        } catch (error) {
            throw error;
        }
    }

    public async getUserById(id: string): Promise<any> {
        try {
            const result = await this._queryBus.execute(new GetUserByIdQuery(id));
            return result;
        } catch (error) {
            throw error;
        }
    }

    public async getUserByEmail(email: string): Promise<any> {
        try {
            const result = await this._queryBus.execute(new GetUserByEmailQuery(email));
            return result;
        } catch (error) {
            throw error;
        }
    }

    public async updateUserProfile(id: string, userId: string, profile: ProfileBodyDto): Promise<any> {
        try {
            const result = await this._commandBus.execute(
                new UpdateUserProfileCommand(id, userId, profile)
            );
            runOnTransactionCommit(() => { });
            return result;
        } catch (error) {
            runOnTransactionRollback(() => { });
            throw error;
        } finally {
            runOnTransactionComplete(() => { });
        }
    }

    public async deleteUser(id: string, userId: string,): Promise<any> {
        try {
            const result = await this._commandBus.execute(
                new DeleteUserCommand(id, userId)
            );
            runOnTransactionCommit(() => { });
            return result;
        } catch (error) {
            runOnTransactionRollback(() => { });
            throw error;
        } finally {
            runOnTransactionComplete(() => { });
        }
    }

    public async mqHealthCheck(): Promise<any> {
        try {
            const result = await this._queryBus.execute(
                new MqHealthCheckQuery()
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

