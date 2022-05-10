import { CommandHandler,ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@src/shared/entities/user.entity";
import { NotFoundException } from "@src/shared/models/error/http.error";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { Inject } from "typedi";
import { Repository } from "typeorm";

import { RefreshCommand } from "../impl";

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
    constructor(
        @Inject("JwtService")
        private readonly _jwtService: JwtService,
        @InjectRepository(User)
        private readonly _userRepo: Repository<User>
    ) { }

    async execute(command: RefreshCommand) {
        const { args } = command;
        const { account, refreshToken } = args;

        const userId = await (
            await this._jwtService.getUserAccountFromRefreshToken(refreshToken)
        ).split(":")[0];

        const user = await this._userRepo.findOne({
            account: account,
            id: userId,
        });

        if (!user) {
            throw new NotFoundException(`User doesn't exist`, {
                context: `RefreshHandler`,
            });
        }
        if (!(await this._jwtService.refreshTokenExists(refreshToken))) {
            throw new NotFoundException(`Refresh token doesn't exist`, {
                context: `RefreshHandler`,
            });
        }

        this._jwtService.clearAllSessions(user.id);
        const accessToken = await this._jwtService.signJwt({ userId: user.id });
        const newRefreshToken = this._jwtService.createRefreshToken();
        await this._jwtService.registerToken(
            user.id,
            newRefreshToken,
            "refresh"
        );

        return {
            accessToken: accessToken,
            refreshToken: newRefreshToken,
        };
    }
}
