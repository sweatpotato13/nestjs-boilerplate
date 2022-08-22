import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";


@Injectable()
export class AuthService {
    constructor(
        // private readonly _commandBus: CommandBus,
        // private readonly _queryBus: QueryBus,
    ) { }

    public async healthCheck(): Promise<any> {
        try {
            const result = "";
            return result;
        } catch (error) {
            throw error;
        }
    }

    public async googleLogin(req: any) {
        if (!req.user) {
            return 'No user from google'
        }

        return {
            message: 'User information from google',
            user: req.user
        }
    }
}
