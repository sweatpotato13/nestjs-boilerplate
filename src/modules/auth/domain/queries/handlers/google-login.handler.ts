import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { GoogleLoginQuery } from "../impl";

@QueryHandler(GoogleLoginQuery)
export class GoogleLoginHandler implements IQueryHandler<GoogleLoginQuery> {
    constructor() { }

    async execute(command: GoogleLoginQuery) {
        try {
            const { args } = command;
            const { req } = args;

            if (!req.user) {
                return 'No user from google'
            }

            return {
                message: 'User information from google',
                user: req.user
            }
        } catch (error: any) {
            throw error;
        }
    }
}
