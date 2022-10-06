import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { GoogleLoginQuery } from "../domain/queries/impl";


@Injectable()
export class AuthService {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus,
    ) { }

    public async googleLogin(req: any): Promise<any> {
        try {
            const result = await this._queryBus.execute(new GoogleLoginQuery(req));
            return result;
        } catch (error) {
            throw error;
        }
    }
}
