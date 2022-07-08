import { plainToClass } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { UserDto } from "../interfaces/entities";
import { UserRole } from "./user-role.entity";

@Entity("user", { schema: "public" })
export class User {
    @PrimaryGeneratedColumn("uuid", {
        name: "id",
    })
    id: string;

    @Column("text", {
        name: "account",
    })
    account: string;

    @Column("text", {
        name: "password_hash",
    })
    passwordHash: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp",
    })
    updatedAt: Date;

    @OneToMany(() => UserRole, userRole => userRole.user, {
        eager: true,
    })
    userRoles: UserRole[];

    toDto() {
        return plainToClass(UserDto, this);
    }

    public static of(params: Partial<User>): User {
        const user = new User();

        Object.assign(user, params);

        return user;
    }
}