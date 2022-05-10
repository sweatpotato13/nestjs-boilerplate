import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Role,User, UserRole } from '@src/shared/entities';
import { BadRequestException } from '@src/shared/models/error/http.error';
import { JwtService } from '@src/shared/modules/jwt/jwt.service';
import { Inject } from 'typedi';
import { Repository } from 'typeorm';

import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
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

    async execute(command: RegisterCommand) {
        const { args } = command;
        const { account } = args;

        let user = await this._userRepo.findOne({
            account: account,
        });

        if (user) {
            throw new BadRequestException("User already exist", { context: "RegisterHandler" });
        }

        const newUser = await this._userRepo.create({
            account: account,
        });
        user = await this._userRepo.save(newUser);

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