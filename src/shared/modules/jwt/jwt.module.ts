import { JwtModuleConfig } from "@config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { App } from "@src/shared/entities/app.entity";
import { Role } from "@src/shared/entities/role.entity";
import { User } from "@src/shared/entities/user.entity";
import { UserRole } from "@src/shared/entities/user-role.entity";

import { RedisModule } from "../redis/redis.module";
import { JwtService } from "./jwt.service";

@Module({
    imports: [
        ConfigModule.forFeature(JwtModuleConfig),
        RedisModule,
        TypeOrmModule.forFeature([User, Role, UserRole, App])
    ],
    providers: [
        {
            provide: "JwtService",
            useClass: JwtService
        }
    ],
    exports: ["JwtService"]
})
export class JwtModule { }
