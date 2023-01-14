import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@src/shared/entities";
import { NotFoundException, ValidationException } from "@src/shared/models/error/http.error";
import { JwtService } from "@src/shared/modules/jwt/jwt.service";
import { Inject } from "typedi";
import { Repository } from "typeorm";
import { ResultDto } from "../../dtos";

import { DeregisterCommand } from "../impl";

@CommandHandler(DeregisterCommand)
export class DeregisterHandler implements ICommandHandler<DeregisterCommand> {
    constructor(
        @Inject("JwtService")
        private readonly _jwtService: JwtService,
        @InjectRepository(User)
        private readonly _userRepo: Repository<User>
    ) { }

    async execute(command: DeregisterCommand) {
        const { args } = command;
        const { account, passwordHash } = args;

        const user = await this._userRepo.findOne({
            where: {
                account: account
            }
        });

        if (!user) {
            throw new NotFoundException("User not found", {
                context: "DeregisterHandler"
            });
        }
        if (passwordHash !== user.passwordHash) {
            throw new ValidationException("Wrong password", {
                context: "DeregisterHandler"
            });
        }

        await this._userRepo.remove(user);
        return ResultDto.of({ result: "OK" });
    }
}
