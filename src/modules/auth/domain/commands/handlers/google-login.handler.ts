import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User, UserRole } from "@src/shared/entities";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { assert } from "console";
import { Repository } from "typeorm";

import { TokensResponseDto } from "../../dtos";
import { GoogleLoginCommand } from "../impl/google-login.command";


@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
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

    async execute(command: GoogleLoginCommand) {
        try {
            const { args } = command;
            const { provider, email, name } = args;

            const user = await this._userRepo.findOne({
                where: {
                    email: email
                }
            });

            if (!user) {
                const newUser = await this._userRepo.create({
                    email,
                    name,
                    provider
                });
                const user = await this._userRepo.save(newUser);

                let role = await this._roleRepo.findOne({ where: { name: "user" } });
                if (!role) {
                    role = await this._roleRepo.save(
                        await this._roleRepo.create({
                            name: "user"
                        })
                    );
                }

                const userRole = await this._userRoleRepo.findOne({
                    where: { userId: user.id }
                });
                if (!userRole) {
                    const newUserRole = await this._userRoleRepo.create({
                        userId: user.id,
                        roleId: role.id
                    });
                    await this._userRoleRepo.save(newUserRole);
                }
            }

            this._jwtService.clearAllSessions(user.id);
            const accessToken = await this._jwtService.signUp({
                email,
                userId: user.id
            });

            const refreshToken = this._jwtService.createRefreshToken();

            this._jwtService.registerToken(user.id, refreshToken, "refresh");

            return TokensResponseDto.of({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (error: any) {
            throw error;
        }
    }
}
