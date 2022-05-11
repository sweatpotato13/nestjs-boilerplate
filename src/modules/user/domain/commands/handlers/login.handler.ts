import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, UserRole } from "@src/shared/entities";
import { User } from "@src/shared/entities/user.entity";
import { BadRequestException, NotFoundException } from "@src/shared/models/error/http.error";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { Inject } from "typedi";
import { Repository } from "typeorm";

import { LoginCommand } from "../impl";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(
        @Inject("JwtService")
        private readonly _jwtService: JwtService,
        @InjectRepository(User)
        private readonly _userRepo: Repository<User>,
        @InjectRepository(UserRole)
        private readonly _userRoleRepo: Repository<UserRole>,
        @InjectRepository(Role)
        private readonly _roleRepo: Repository<Role>
    ) { }

    async execute(command: LoginCommand) {
        const { args } = command;
        const { account, passwordHash } = args;

        const user = await this._userRepo.findOne({
            account: account,
        });

        if (!user) {
            throw new NotFoundException("User not found", { context: "LoginHandler" });
        }
        if(passwordHash !== user.passwordHash){
            throw new BadRequestException("Wrong password", { context: "LoginHandler" });
        }

        let role = await this._roleRepo.findOne({ name: "user" });
        if (!role) {
            role = await this._roleRepo.save(
                await this._roleRepo.create({
                    name: "user",
                })
            );
        }

        const userRole = await this._userRoleRepo.findOne({ userId: user.id });
        if (!userRole) {
            const newUserRole = await this._userRoleRepo.create({
                userId: user.id,
                roleId: role.id,
            });
            await this._userRoleRepo.save(newUserRole);
        }

        this._jwtService.clearAllSessions(user.id);
        const accessToken = await this._jwtService.signUp({
            account,
            userId: user.id,
        });

        const refreshToken = this._jwtService.createRefreshToken();

        this._jwtService.registerToken(user.id, refreshToken, "refresh");
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
}
