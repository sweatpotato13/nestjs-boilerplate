import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModuleConfig } from "@config";
import { JwtService } from "./jwt.service";
import { RedisModule } from "../redis/redis.module";
import { App } from "@src/shared/entities/app.entity";
import { Role } from "@src/shared/entities/role.entity";
import { UserRole } from "@src/shared/entities/user-role.entity";
import { User } from "@src/shared/entities/user.entity";

@Module({
    imports: [
        ConfigModule.forFeature(JwtModuleConfig),
        RedisModule,
        TypeOrmModule.forFeature([User, Role, UserRole, App]),
    ],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtModule { }